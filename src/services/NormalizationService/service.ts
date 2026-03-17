import {
  buildBatchNormalizationContext,
  buildSingleNormalizationContext,
  buildTransformedRows,
  saveTransformedRows,
} from "./builders";
import { applyTransform } from "./transformers";
import {
  MappingTarget,
  NormalizedResult,
  NormalizeSingleEntity,
  TransformConfig,
} from "./types";
import { prisma } from "../../../prisma/prisma";
import { getRawValue } from "../../helpers/getRawValue";
import { TARGET_TYPE } from "../../config";
import { createSingleEquipment } from "../EquipmentService/service";

export const mapColumnToAttribute = async (params: {
  sessionId: string;
  colIndex: number;
  target: MappingTarget;
}) =>
  updateColumn(
    params.sessionId,
    params.colIndex,
    [params.target],
    (rawValue) => [rawValue],
  );

export const applyColumnTransformation = async (params: {
  sessionId: string;
  colIndex: number;
  transform: TransformConfig;
  targets: (MappingTarget | null)[];
}) =>
  updateColumn(params.sessionId, params.colIndex, params.targets, (rawValue) =>
    applyTransform(rawValue, params.transform),
  );

const updateColumn = async (
  sessionId: string,
  colIndex: number,
  targets: (MappingTarget | null)[],
  getUpdatedData: (rawValue: any) => any[],
) => {
  const items = await prisma.stagingImportItem.findMany({
    where: { sessionId },
    select: { id: true, rawRow: true, transformedRow: true },
  });

  const updatedValuesByItem = new Map<string, string[]>();
  const rawValueByItem = new Map<string, string>();

  items.forEach((item) => {
    const rawValue = getRawValue(item.rawRow, colIndex);
    const updated = getUpdatedData(rawValue);

    updatedValuesByItem.set(
      item.id,
      updated.map((v) => String(v ?? "")),
    );

    rawValueByItem.set(item.id, String(rawValue ?? ""));
  });

  const { cacheMap, mappingPlans } = await buildBatchNormalizationContext(
    targets,
    updatedValuesByItem,
  );

  const dataToUpdate = buildTransformedRows(
    items,
    colIndex,
    updatedValuesByItem,
    rawValueByItem,
    mappingPlans,
    cacheMap,
  );

  return saveTransformedRows(dataToUpdate);
};

export const applyAiParse = async (params: {
  importSessionId: string;
  parsingSessionId: string;
  sourceColIndex: number;
  targets: MappingTarget[];
}) => {
  const { importSessionId, parsingSessionId, sourceColIndex, targets } = params;

  const aiRows = await prisma.aiParseResult.findMany({
    where: { sessionId: parsingSessionId },
  });

  if (!aiRows.length) {
    throw new Error("Parsing session not found");
  }

  const items = await prisma.stagingImportItem.findMany({
    where: { sessionId: importSessionId },
    select: { id: true, rawRow: true, transformedRow: true },
  });

  const rawValueByItem = new Map<string, string>();

  items.forEach((item) => {
    const rawValue = getRawValue(item.rawRow, sourceColIndex);
    rawValueByItem.set(item.id, String(rawValue ?? ""));
  });

  const grouped = new Map<string, Map<string, string>>();

  aiRows.forEach((r) => {
    if (!grouped.has(r.sourceItemId)) {
      grouped.set(r.sourceItemId, new Map());
    }

    grouped.get(r.sourceItemId)!.set(r.targetKey, r.rawValue ?? "");
  });

  const updatedValuesByItem = new Map<string, string[]>();

  grouped.forEach((targetMap, itemId) => {
    const values = targets.map(
      (t) =>
        targetMap.get(t.type === TARGET_TYPE.ATTRIBUTE ? t.id : t.field) ?? "",
    );
    updatedValuesByItem.set(itemId, values);
  });

  const { cacheMap, mappingPlans } = await buildBatchNormalizationContext(
    targets,
    updatedValuesByItem,
  );

  const dataToUpdate = buildTransformedRows(
    items,
    sourceColIndex,
    updatedValuesByItem,
    rawValueByItem,
    mappingPlans,
    cacheMap,
  );

  const result = await saveTransformedRows(dataToUpdate);

  prisma.aiParseResult
    .deleteMany({ where: { sessionId: parsingSessionId } })
    .catch(console.error);

  return result;
};

export const normalizeSingleEntity = async (params: {
  sessionId: string;
  inputs: NormalizeSingleEntity[];
}) => {
  const { sessionId, inputs } = params;

  if (!inputs.length) return [];

  const { values, cacheMap, mappingPlans } =
    await buildSingleNormalizationContext(inputs);

  const data = mappingPlans
    .map((plan, index) => {
      if (!plan) return null;

      const rawValue = values[index] ?? "";

      const normalized = plan.normalizer(rawValue, cacheMap);

      return {
        target: plan.target,
        rawValue,
        normalized,
      };
    })
    .filter((r): r is NormalizedResult => r !== null);

  const result = await createSingleEquipment({
    sessionId,
    normalizedData: data,
  });

  return result;
};
