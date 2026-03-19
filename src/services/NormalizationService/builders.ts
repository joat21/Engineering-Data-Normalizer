import { JsonValue } from "@prisma/client/runtime/client";
import { getCacheMap, getMappingPlans, getAttributeInfoMap } from "./helpers";
import {
  AttributeInfo,
  EnrichedTarget,
  isNormalizedValue,
  MappingPlan,
  MappingTarget,
  NormalizeSingleEntity,
  TransformedRow,
} from "./types";
import { prisma } from "../../../prisma/prisma";
import { DATA_TYPE, TARGET_TYPE } from "../../config";
import { DataType } from "../../types";

export const buildBatchNormalizationContext = async (
  targets: (MappingTarget | null)[],
  valuesByItem: Map<string, string[]>,
) => {
  return buildNormalizationContext(targets, valuesByItem);
};

export const buildSingleNormalizationContext = async (
  inputs: NormalizeSingleEntity[],
) => {
  // при нормализации данных из колонки targets приходят с фронта отдельно,
  // и values под них собираются на ходу из БД, чтобы не делать этого на фронте
  // для нормализации одной сущности (через заполнение формы на фронте)
  // удобно сразу присылать с фронта массив { target, value }[]
  // и для переиспользования существующего кода разделить его на targets[] и values[]
  const targets = inputs.map((i) => i.target);
  const values = inputs.map((i) => String(i.value ?? "").trim());

  // при нормализации колонки: item - это строка таблицы, batch обработка
  // при нормализации одной сущности есть только один item, так как нет таблицы
  // Эмулируем batch-структуру, так как ее ожидает getCacheMap внутри buildNormalizationContext
  const valuesByItem = new Map<string, string[]>();
  valuesByItem.set("single", values);

  const context = await buildNormalizationContext(targets, valuesByItem);

  return { values, ...context };
};

const buildNormalizationContext = async (
  targets: (MappingTarget | null)[],
  valuesByItem: Map<string, string[]>,
) => {
  const attributeInfoMap = await getAttributeInfoMap(targets);
  const cacheMap = await getCacheMap(targets, valuesByItem, attributeInfoMap);
  const mappingPlans = getMappingPlans(targets, attributeInfoMap);

  return {
    attributeInfoMap,
    cacheMap,
    mappingPlans,
  };
};

const buildColumnMappings = (
  rawValue: any,
  values: any[],
  mappingPlans: (MappingPlan | null)[],
  cacheMap: Map<string, JsonValue>,
) => {
  return mappingPlans
    .map((plan, i) => {
      if (!plan) return null;

      const valueToNormalize = String(values[i] ?? "");
      return {
        target: plan.target,
        rawValue: String(rawValue),
        normalized: plan.normalizer(valueToNormalize, cacheMap),
      };
    })
    .filter((m) => m !== null);
};

export const buildTransformedRows = async (params: {
  items: {
    id: string;
    rawRow: JsonValue;
    transformedRow: JsonValue;
  }[];
  colIndex: number;
  targets: (MappingTarget | null)[];
  updatedValuesByItem: Map<string, string[]>;
  rawValueByItem: Map<string, string>;
}) => {
  const { items, colIndex, targets, updatedValuesByItem, rawValueByItem } =
    params;

  const issuesMap = new Map<
    string,
    {
      target: EnrichedTarget;
      unnormalizedValues: Set<string>;
    }
  >();

  const { attributeInfoMap, cacheMap, mappingPlans } =
    await buildBatchNormalizationContext(targets, updatedValuesByItem);

  const transformedRows = items.map((item) => {
    const rawValue = rawValueByItem.get(item.id) || "";
    const values = updatedValuesByItem.get(item.id) || [];

    const columnMappings = buildColumnMappings(
      rawValue,
      values,
      mappingPlans,
      cacheMap,
    );

    for (const mapping of columnMappings) {
      if (isNormalizedValue(mapping.normalized)) continue;

      const target = mapping.target;
      const targetKey =
        target.type === TARGET_TYPE.ATTRIBUTE ? target.id : target.field;

      if (!issuesMap.has(targetKey)) {
        issuesMap.set(targetKey, {
          target: {
            ...target,
            label:
              attributeInfoMap.get(targetKey)?.label || "Неизвестный атрибут",
            dataType:
              attributeInfoMap.get(targetKey)?.dataType || DATA_TYPE.STRING,
          },
          unnormalizedValues: new Set<string>(),
        });
      }

      const valueToAdd = mapping.normalized.valueString;
      issuesMap.get(targetKey)?.unnormalizedValues.add(valueToAdd);
    }

    const existingRow =
      (item.transformedRow as unknown as TransformedRow) || {};

    const newData: TransformedRow = {
      ...existingRow,
      [colIndex.toString()]: columnMappings,
    };

    return {
      id: item.id,
      transformedRow: newData,
    };
  });

  return {
    transformedRows,
    issues: Array.from(issuesMap.values()).map((v) => ({
      ...v,
      unnormalizedValues: Array.from(v.unnormalizedValues),
    })),
  };
};

export const saveTransformedRows = async (
  transformedRows: { id: string; transformedRow: TransformedRow }[],
) => {
  const payload = JSON.stringify(transformedRows);

  await prisma.$executeRaw`
    UPDATE "StagingImportItem" AS t
    SET "transformedRow" = v."transformedRow"
    FROM json_to_recordset(${payload}::json) AS v(
      "id" uuid,
      "transformedRow" jsonb
    )
    WHERE t.id = v.id
  `;
};
