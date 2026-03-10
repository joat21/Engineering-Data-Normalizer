import { JsonValue } from "@prisma/client/runtime/client";
import { prisma } from "../../prisma/prisma";
import * as TransformUtils from "../helpers/transformers";
import { TransformConfig } from "../schemas/normalization";
import {
  normalizeValue,
  isSimpleNumeric,
  TransformedRow,
} from "../helpers/normalizers";

export type TransformType = TransformConfig["type"];

type TransformPayloadMap = {
  [T in TransformType]: Extract<TransformConfig, { type: T }> extends {
    payload: infer P;
  }
    ? P
    : undefined;
};

type TransformStrategyMap = {
  [T in TransformType]: TransformPayloadMap[T] extends undefined
    ? (val: TransformUtils.TransformPayload) => (string | number | null)[]
    : (
        val: TransformUtils.TransformPayload,
        payload: TransformPayloadMap[T],
      ) => (string | number | null)[];
};

const TRANSFORM_STRATEGIES: TransformStrategyMap = {
  EXTRACT_NUMBERS: (val) => TransformUtils.parseNumbers(String(val)),

  SPLIT_BY: (val, payload) =>
    TransformUtils.splitBySeparator(String(val), payload.separator),

  MULTIPLY: (val, payload) =>
    TransformUtils.multiplyNumbersInString(val, payload.factor),
};

const applyTransform = (
  value: TransformUtils.TransformPayload,
  transform: TransformConfig,
) => {
  switch (transform.type) {
    case "EXTRACT_NUMBERS":
      return TRANSFORM_STRATEGIES.EXTRACT_NUMBERS(value);

    case "SPLIT_BY":
      return TRANSFORM_STRATEGIES.SPLIT_BY(value, transform.payload);

    case "MULTIPLY":
      return TRANSFORM_STRATEGIES.MULTIPLY(value, transform.payload);

    default: {
      const _exhaustive: never = transform;
      return _exhaustive;
    }
  }
};

export const applyColumnTransformation = async (params: {
  sessionId: string;
  colIndex: number;
  transform: TransformConfig;
  attributesOrder: string[];
}) =>
  processColumnUpdate(
    params.sessionId,
    params.colIndex,
    params.attributesOrder,
    (rawValue) => applyTransform(rawValue, params.transform),
  );

export const mapColumnToAttribute = async (params: {
  sessionId: string;
  colIndex: number;
  attributeId: string;
}) =>
  processColumnUpdate(
    params.sessionId,
    params.colIndex,
    [params.attributeId],
    (rawValue) => [rawValue],
  );

const processColumnUpdate = async (
  sessionId: string,
  colIndex: number,
  attributeIds: string[],
  getUpdatedData: (rawValue: any) => any[],
) => {
  const attributes = await prisma.categoryAttribute.findMany({
    where: { id: { in: attributeIds } },
    select: { id: true, dataType: true },
  });
  const typeMap = new Map(attributes.map((a) => [a.id, a.dataType]));

  const items = await prisma.stagingImportItem.findMany({
    where: { sessionId },
    select: { id: true, rawRow: true, transformedRow: true },
  });

  const cacheLookupSet = new Set<string>();

  items.forEach((item) => {
    const rawValue = getRawValue(item.rawRow, colIndex);
    const updatedData = getUpdatedData(rawValue);

    attributeIds.forEach((attrId, i) => {
      const val = String(updatedData[i] ?? "")
        .toLowerCase()
        .trim();
      const attrType = typeMap.get(attrId);

      if (attrType !== "NUMBER") {
        cacheLookupSet.add(`${attrId}:${val}`);
      } else {
        const parts = val.split(/[\s]*[xх×][\s]*/).filter((p) => p.length > 0);
        parts.forEach((p) => {
          if (!isSimpleNumeric(p)) {
            cacheLookupSet.add(`${attrId}:${p.trim()}`);
          }
        });
      }
    });
  });

  const cacheEntries = await prisma.normalizationCache.findMany({
    where: {
      OR: Array.from(cacheLookupSet).map((pair) => {
        const [attrId, clean] = pair.split(":");
        return { attributeId: attrId, cleanedValue: clean };
      }),
    },
  });

  const cacheMap = new Map(
    cacheEntries.map((e) => [
      `${e.attributeId}:${e.cleanedValue}`,
      e.normalized,
    ]),
  );

  const dataToUpdate = items.map((item) => {
    const rawValue = getRawValue(item.rawRow, colIndex);
    const updatedData = getUpdatedData(rawValue);

    const columnMappings = attributeIds.map((attrId, i) => {
      const valueToNormalize = String(updatedData[i] ?? "");
      const attrType = typeMap.get(attrId) || "STRING";

      return {
        attributeId: attrId,
        rawValue: String(rawValue),
        normalized: normalizeValue(
          valueToNormalize,
          attrType,
          attrId,
          cacheMap,
        ),
      };
    });

    const existingRow =
      (item.transformedRow as unknown as TransformedRow) || {};

    const newData: TransformedRow = {
      ...existingRow,
      [colIndex.toString()]: columnMappings,
    };

    return {
      id: item.id,
      transformedRow: JSON.stringify(newData).replace(/'/g, "''"),
    };
  });

  if (dataToUpdate.length === 0) return { success: true, count: 0 };

  const values = dataToUpdate
    .map((d) => `('${d.id}'::uuid, '${d.transformedRow}'::jsonb)`)
    .join(",");

  await prisma.$executeRawUnsafe(`
    UPDATE "StagingImportItem" AS t
    SET "transformedRow" = v.new_val
    FROM (VALUES ${values}) AS v(id, new_val)
    WHERE t.id = v.id;
  `);

  return { success: true, count: dataToUpdate.length };
};

const getRawValue = (
  rawRow: JsonValue,
  colIndex: number,
): TransformUtils.TransformPayload => {
  if (!Array.isArray(rawRow)) return null;

  const val = rawRow[colIndex];
  return typeof val === "string" || typeof val === "number" || val === null
    ? val
    : null;
};
