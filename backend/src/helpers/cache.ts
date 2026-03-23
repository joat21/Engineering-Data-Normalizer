import { DataType } from "@engineering-data-normalizer/shared";
import { DIMENSION_SEPARATORS_REGEX } from "../config";

import { cleanValue } from "./cleanValue";
import { isSimpleNumeric } from "./isSimpleNumeric";

export const isCacheRequired = (val: string, type: DataType): boolean => {
  const cleanVal = cleanValue(val);
  if (!cleanVal) return false;

  if (type !== DataType.NUMBER) {
    return true;
  }

  const parts = cleanVal.split(DIMENSION_SEPARATORS_REGEX).filter(Boolean);
  return parts.some((p) => !isSimpleNumeric(p.trim()));
};

export const getCacheableCleanedValues = (
  rawValue: string,
  dataType: string,
): string[] => {
  const cleanVal = rawValue.toLowerCase().trim();
  if (!cleanVal) return [];

  if (dataType !== DataType.NUMBER) {
    return [cleanVal];
  }

  // Сплит по разделителям размерности,
  // чтобы отдельно обрабатывать части строк вида '1.25"x2"'
  const parts = cleanVal.split(DIMENSION_SEPARATORS_REGEX).filter(Boolean);
  return parts.filter((p) => !isSimpleNumeric(p)).map((p) => p.trim());
};

export const getCacheKey = (attributeId: string, value: string) =>
  `${attributeId}:${cleanValue(value)}`;
