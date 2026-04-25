import { TransformPayload } from "@engineering-data-normalizer/shared";
import { JsonValue } from "@prisma/client/runtime/client";

export const getRawValue = (
  rawRow: JsonValue,
  colIndex: number,
): TransformPayload => {
  if (!Array.isArray(rawRow)) return null;

  const val = rawRow[colIndex];
  return typeof val === "string" || typeof val === "number" || val === null
    ? val
    : null;
};
