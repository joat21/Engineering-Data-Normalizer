import { JsonValue } from "@prisma/client/runtime/client";
import { TransformConfig, MappingTarget } from "../../schemas/normalization";

export type TransformPayload = string | number | null;

export type TransformType = TransformConfig["type"];

export type TransformPayloadMap = {
  [T in TransformType]: Extract<TransformConfig, { type: T }> extends {
    payload: infer P;
  }
    ? P
    : undefined;
};

export interface NormalizedValue {
  valueString: string;
  valueMin?: number;
  valueMax?: number;
  valueArray?: number[];
  valueBoolean?: boolean;
}

export interface UnnormalizedValue {
  valueString: string;
  needsCheck: true;
}

export const SYSTEM_FIELDS = [
  "name",
  "article",
  "model",
  "externalCode",
  "price",
  "manufacturer",
] as const;

export type SystemField = (typeof SYSTEM_FIELDS)[number];

export interface MappingPlan {
  target: MappingTarget;
  normalizer: (
    val: string,
    cache: Map<string, JsonValue>,
  ) => NormalizedValue | UnnormalizedValue;
}

export interface TransformedColumn {
  target: MappingTarget;
  rawValue: string;
  normalized: NormalizedValue;
}

export type TransformedRow = Record<string, TransformedColumn[]>;

export { TransformConfig, MappingTarget } from "../../schemas/normalization";
