import { DataType } from "../generated/prisma/enums";
import { parseNumbers } from "./transformers";

export interface NormalizedValue {
  valueString: string;
  valueMin?: number;
  valueMax?: number;
  valueArray?: number[];
  valueBoolean?: boolean;
}

export interface TransformedColumn {
  attributeId: string;
  rawValue: string;
  normalized: NormalizedValue;
}

export type TransformedRow = Record<string, TransformedColumn[]>;

const normalizeNumeric = (rawValue: string): NormalizedValue => {
  const result: NormalizedValue = {
    valueString: rawValue.trim(),
  };

  const nums = parseNumbers(rawValue);

  if (nums.length > 0) {
    result.valueMin = Math.min(...nums);
    result.valueMax = Math.max(...nums);

    if (nums.length >= 3) {
      result.valueArray = nums;
    }
  }

  return result;
};

const normalizeString = (rawValue: string): NormalizedValue => ({
  valueString: rawValue.trim(),
});

const normalizeBoolean = (rawValue: string): NormalizedValue => {
  const clean = rawValue.toLowerCase().trim();
  // TODO: подумать над списком true значений
  const positive = ["да", "yes", "true", "1", "есть", "вкл", "+", "v"];
  const isTrue = positive.includes(clean);

  return {
    valueString: isTrue ? "Да" : "Нет",
    valueBoolean: isTrue,
  };
};

export const applyNormalizationByType = (
  rawValue: string,
  type: DataType,
): NormalizedValue => {
  switch (type) {
    case "NUMBER":
      return normalizeNumeric(rawValue);
    case "BOOLEAN":
      return normalizeBoolean(rawValue);
    case "STRING":
    default:
      return normalizeString(rawValue);
  }
};
