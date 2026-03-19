import { JsonValue } from "@prisma/client/runtime/client";
import { v4 as uuidv4 } from "uuid";
import { isSimpleNumeric, normalizeValue } from "./normalizers";
import {
  AttributeInfo,
  AttributeTarget,
  EnrichedTarget,
  MappingPlan,
  MappingTarget,
  NormalizationIssue,
  NormalizationOption,
  NormalizedValue,
} from "./types";
import { prisma } from "../../../prisma/prisma";
import { DATA_TYPE, TARGET_TYPE } from "../../config";
import { booleanNormalizationOptions } from "./config";

export const getAttributeInfoMap = async (
  targets: (MappingTarget | null)[],
) => {
  const attrIds = targets
    .filter((t): t is AttributeTarget => t?.type === TARGET_TYPE.ATTRIBUTE)
    .map((t) => t.id);

  if (attrIds.length === 0) {
    return new Map<string, AttributeInfo>();
  }

  const attributes = await prisma.categoryAttribute.findMany({
    where: { id: { in: attrIds } },
    select: { id: true, dataType: true, label: true },
  });

  return new Map<string, AttributeInfo>(
    attributes.map((a) => [a.id, { dataType: a.dataType, label: a.label }]),
  );
};

export const getCacheMap = async (
  targets: (MappingTarget | null)[],
  valuesByItem: Map<string, string[]>,
  attributeInfoMap: Map<string, AttributeInfo>,
) => {
  if (attributeInfoMap.size === 0) {
    return new Map<string, JsonValue>();
  }

  const cacheLookupSet = new Set<string>();

  for (const values of valuesByItem.values()) {
    targets.forEach((target, i) => {
      if (!target || target.type !== TARGET_TYPE.ATTRIBUTE) return;

      const val = String(values[i] ?? "")
        .toLowerCase()
        .trim();

      const attrType = attributeInfoMap.get(target.id)?.dataType;

      if (attrType !== DATA_TYPE.NUMBER) {
        cacheLookupSet.add(`${target.id}:${val}`);
      } else {
        const parts = val.split(/[\s]*[xх×][\s]*/).filter(Boolean);

        parts.forEach((p) => {
          if (!isSimpleNumeric(p)) {
            cacheLookupSet.add(`${target.id}:${p.trim()}`);
          }
        });
      }
    });
  }

  const cacheEntries = await prisma.normalizationCache.findMany({
    where: {
      OR: Array.from(cacheLookupSet).map((pair) => {
        const [attrId, clean] = pair.split(":");
        return { attributeId: attrId, cleanedValue: clean };
      }),
    },
  });

  return new Map(
    cacheEntries.map((e) => [
      `${e.attributeId}:${e.cleanedValue}`,
      e.normalized,
    ]),
  );
};

export const getMappingPlans = (
  targets: (MappingTarget | null)[],
  attributeInfoMap: Map<string, AttributeInfo>,
): (MappingPlan | null)[] => {
  return targets.map((target) => {
    if (!target) return null;

    if (target.type === TARGET_TYPE.SYSTEM) {
      return {
        target,
        normalizer: (val: string) => ({ valueString: val }),
      };
    }

    return {
      target,
      normalizer: (val: string, cache: Map<string, JsonValue>) =>
        normalizeValue(
          val,
          attributeInfoMap.get(target.id)?.dataType || DATA_TYPE.STRING,
          target.id,
          cache,
        ),
    };
  });
};

export const enrichIssuesWithOptions = async (
  conflicts: { target: EnrichedTarget; unnormalizedValues: string[] }[],
): Promise<NormalizationIssue[]> => {
  const optionsMap = new Map<string, NormalizationOption[]>();

  const stringAttrKeys = conflicts
    .filter((v) => v.target.type === TARGET_TYPE.ATTRIBUTE)
    .map((v) =>
      v.target.type === TARGET_TYPE.ATTRIBUTE ? v.target.id : v.target.field,
    );

  if (stringAttrKeys.length) {
    const cache = await prisma.$queryRaw<
      { attributeId: string; normalized: NormalizedValue }[]
    >`
    SELECT DISTINCT ON ("attributeId", "normalized"->>'valueString')
      "attributeId",
      "normalized"
    FROM "NormalizationCache"
    WHERE "attributeId"::uuid = ANY(${stringAttrKeys}::uuid[])
  `;

    cache.forEach((entry) => {
      if (!optionsMap.has(entry.attributeId)) {
        optionsMap.set(entry.attributeId, []);
      }

      optionsMap.get(entry.attributeId)!.push({
        id: uuidv4(),
        label: entry.normalized.valueString,
        normalized: entry.normalized,
      });
    });
  }

  return conflicts.map((conflict) => {
    const key =
      conflict.target.type === TARGET_TYPE.ATTRIBUTE
        ? conflict.target.id
        : conflict.target.field;
    let options = optionsMap.get(key) || [];

    // Если это булево, добавляем стандартные Да/Нет, если их нет в кэше
    if (
      conflict.target.dataType === DATA_TYPE.BOOLEAN &&
      options.length === 0
    ) {
      options = booleanNormalizationOptions;
    }

    return {
      ...conflict,
      normalizationOptions: options,
    };
  });
};
