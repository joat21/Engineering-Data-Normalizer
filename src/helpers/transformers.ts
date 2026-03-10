export type TransformPayload = string | number | null;

const numberRegex = /-?\d+(?:[.,]\d+)?/g;

export const parseNumbers = (input: TransformPayload): number[] => {
  if (!input) return [];

  const str = typeof input === "string" ? input : String(input);
  return (str.match(numberRegex) || []).map((n) => Number(n.replace(",", ".")));
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
