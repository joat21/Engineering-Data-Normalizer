import { JsonValue } from "@prisma/client/runtime/client";
import {
  DataType,
  NormalizedValue,
  parseNumbers,
} from "@engineering-data-normalizer/shared";
import { UnnormalizedValue } from "../types";
import { DIMENSION_SEPARATORS_REGEX } from "../../../config";
import { isSimpleNumeric } from "../../../helpers/isSimpleNumeric";
import { cleanValue } from "../../../helpers/cleanValue";

export const normalizeValue = (
  rawValue: string,
  type: DataType,
  attributeId: string,
  cacheMap: Map<string, JsonValue>,
): NormalizedValue | UnnormalizedValue =>
  type === DataType.NUMBER
    ? normalizeNumeric(rawValue, attributeId, cacheMap)
    : normalizeStringOrBoolean(rawValue, attributeId, cacheMap);

const normalizeNumeric = (
  rawValue: string,
  attributeId: string,
  cacheMap: Map<string, JsonValue>,
): NormalizedValue | UnnormalizedValue => {
  // Сплит по разделителям размерности,
  // чтобы отдельно обрабатывать части строк вида '1.25"x2"'
  const parts = rawValue
    .toLowerCase()
    .split(DIMENSION_SEPARATORS_REGEX)
    .filter((p) => p.length > 0);

  const normalizedParts = parts.map((part) => {
    const partClean = part.trim();
    const partKey = `${attributeId}:${partClean}`;

    if (isSimpleNumeric(partClean)) {
      const nums = parseNumbers(partClean);
      return { nums, needsCheck: false };
    }

    if (cacheMap.has(partKey)) {
      const cached = cacheMap.get(partKey) as unknown as NormalizedValue;
      const nums = [cached.valueMin, cached.valueMax].filter(
        (v) => v !== undefined,
      );
      return { nums, needsCheck: false };
    }

    return { nums: parseNumbers(partClean), needsCheck: true };
  });

  const allNums = normalizedParts.flatMap((p) => p.nums);
  const needsCheck = normalizedParts.some((p) => p.needsCheck);

  if (needsCheck) {
    return {
      valueString: rawValue.trim(),
      needsCheck,
    };
  }

  return {
    valueString: rawValue.trim(),
    valueMin: allNums.length > 0 ? Math.min(...allNums) : undefined,
    valueMax: allNums.length > 0 ? Math.max(...allNums) : undefined,
    valueArray: allNums.length >= 3 ? allNums : undefined,
  };
};

const normalizeStringOrBoolean = (
  rawValue: string,
  attributeId: string,
  cacheMap: Map<string, JsonValue>,
): NormalizedValue | UnnormalizedValue => {
  const cleaned = cleanValue(rawValue);
  const key = `${attributeId}:${cleaned}`;
  const cached = cacheMap.get(key);

  return cached
    ? (cached as unknown as NormalizedValue)
    : {
        valueString: rawValue.trim(),
        needsCheck: true,
      };
};
