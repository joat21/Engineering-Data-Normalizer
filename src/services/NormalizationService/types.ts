import z from "zod";
import { JsonValue } from "@prisma/client/runtime/client";
import {
  attributeTargetSchema,
  systemTargetSchema,
  transformSchema,
} from "../../schemas/normalization";

export type TransformPayload = string | number | null;

export type TransformConfig = z.infer<typeof transformSchema>;

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

export type SystemTarget = z.infer<typeof systemTargetSchema>;
export type AttributeTarget = z.infer<typeof attributeTargetSchema>;
export type MappingTarget = SystemTarget | AttributeTarget;

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

export type NormalizeSingleEntity = {
  target: MappingTarget;
  value: string | null | undefined;
};

export type NormalizedResult = {
  target: MappingTarget;
  rawValue: string;
  normalized: ReturnType<MappingPlan["normalizer"]>;
};
