import { TransformPayload } from "./types";
import { TransformConfig } from "../../schemas/normalization";

const numberRegex = /-?\d+(?:[.,]\d+)?/g;

export const applyTransform = (
  value: TransformPayload,
  transform: TransformConfig,
) => {
  switch (transform.type) {
    case "EXTRACT_NUMBERS":
      return parseNumbers(String(value));

    case "SPLIT_BY":
      return splitBySeparator(String(value), transform.payload.separator);

    case "MULTIPLY":
      return multiplyNumbersInString(String(value), transform.payload.factor);

    default: {
      const _exhaustive: never = transform;
      return _exhaustive;
    }
  }
};

export const parseNumbers = (input: TransformPayload): number[] => {
  if (!input) return [];

  return (String(input).match(numberRegex) || []).map((n) =>
    Number(n.replace(",", ".")),
  );
};

export const splitBySeparator = (
  input: TransformPayload,
  separator: string,
): string[] => {
  if (!input) return [];

  return String(input)
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const multiply = (input: TransformPayload, factor: number) => {
  if (!input) return [];

  const nums = parseNumbers(input);
  console.log(
    nums,
    nums.map((n) => n * factor),
  );
  return nums.map((n) => n * factor);
};

export const multiplyNumbersInString = (
  input: TransformPayload,
  factor: number,
): string[] => {
  if (!input) return [];

  const res = String(input).replace(numberRegex, (match) => {
    const num = parseFloat(match.replace(",", "."));
    const transformed = num * factor;

    // toFixed(4) - подумать над указанием точности, чтобы не отбросить лишнего
    return parseFloat(transformed.toFixed(4)).toString();
  });

  return [res];
};
