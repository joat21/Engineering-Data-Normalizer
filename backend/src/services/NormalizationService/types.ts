import z from "zod";
import { JsonValue } from "@prisma/client/runtime/client";
import {
  DataType,
  MappingTarget,
  NormalizedData,
  NormalizedValue,
  TransformType,
  transformConfigSchema,
} from "@engineering-data-normalizer/shared";

export type TransformConfig = z.infer<typeof transformConfigSchema>;

export type TransformPayloadMap = {
  [T in TransformType]: Extract<TransformConfig, { type: T }> extends {
    payload: infer P;
  }
    ? P
    : undefined;
};

export interface UnnormalizedValue {
  valueString: string;
  needsCheck: true;
}

export interface MappingPlan {
  target: MappingTarget;
  normalizer: (
    val: string,
    cache: Map<string, JsonValue>,
  ) => NormalizedValue | UnnormalizedValue;
}

export type TransformedRow = Record<string, NormalizedData[]>;

export type NormalizeSingleEntity = {
  target: MappingTarget;
  value: string | null | undefined;
};

export interface AttributeInfo {
  dataType: DataType;
  label: string;
}

export const isNormalizedValue = (
  val: NormalizedValue | UnnormalizedValue,
): val is NormalizedValue => {
  return !(val as UnnormalizedValue).needsCheck;
};

export type EnrichedTarget = MappingTarget & {
  label: string;
  dataType: DataType;
};

export interface NormalizationOption {
  id: string;
  label: string;
  normalized: NormalizedValue;
}

export interface NormalizationIssue {
  target: EnrichedTarget;
  unnormalizedValues: string[];
  normalizationOptions: NormalizationOption[];
}
