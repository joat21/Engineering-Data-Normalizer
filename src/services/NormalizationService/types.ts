import { TransformConfig } from "../../schemas/normalization";

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

export interface TransformedColumn {
  attributeId: string;
  rawValue: string;
  normalized: NormalizedValue;
}

export type TransformedRow = Record<string, TransformedColumn[]>;
