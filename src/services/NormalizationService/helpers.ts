import { v4 as uuidv4 } from "uuid";
import {
  EnrichedTarget,
  NormalizationIssue,
  NormalizationOption,
  NormalizedValue,
} from "./types";
import { prisma } from "../../../prisma/prisma";
import { DATA_TYPE, TARGET_TYPE } from "../../config";
import { booleanNormalizationOptions } from "./config";

export const enrichIssuesWithOptions = async (
  issues: { target: EnrichedTarget; unnormalizedValues: string[] }[],
): Promise<NormalizationIssue[]> => {
  const optionsMap = new Map<string, NormalizationOption[]>();

  const stringAttrKeys = issues
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

  return issues.map((issue) => {
    const key =
      issue.target.type === TARGET_TYPE.ATTRIBUTE
        ? issue.target.id
        : issue.target.field;
    let options = optionsMap.get(key) || [];

    // Если это булево, добавляем стандартные Да/Нет, если их нет в кэше
    if (issue.target.dataType === DATA_TYPE.BOOLEAN && options.length === 0) {
      options = booleanNormalizationOptions;
    }

    return {
      ...issue,
      normalizationOptions: options,
    };
  });
};
