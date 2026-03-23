import { z } from "zod";
import {
  mappingTargetSchema,
  normalizedDataSchema,
} from "@engineering-data-normalizer/shared";
import { TRANSFORM_TYPE } from "../config";

export const transformSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(TRANSFORM_TYPE.EXTRACT_NUMBERS) }),
  z.object({
    type: z.literal(TRANSFORM_TYPE.SPLIT_BY),
    payload: z.object({ separator: z.string() }),
  }),
  z.object({
    type: z.literal(TRANSFORM_TYPE.MULTIPLY),
    payload: z.object({ factor: z.number() }),
  }),
]);

export const applyTransformSchema = z.object({
  params: z.object({
    sessionId: z.uuid(),
  }),
  body: z.object({
    colIndex: z.number(),
    transform: transformSchema,
    targets: z.array(mappingTargetSchema.nullable()),
  }),
});

export const mapColToAttrSchema = z.object({
  params: z.object({
    sessionId: z.uuid(),
  }),
  body: z.object({
    colIndex: z.number(),
    target: mappingTargetSchema,
  }),
});

export const normalizeSingleEntitySchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
    inputs: z.array(
      z.object({
        target: mappingTargetSchema,
        value: z.string().nullable(),
      }),
    ),
  }),
});

export const resolveNormalizationIssuesSchema = z.object({
  params: z.object({
    sessionId: z.uuid(),
  }),
  body: z.object({
    colIndex: z.number(),
    targets: z.array(mappingTargetSchema.nullable()),
    resolutions: z.array(normalizedDataSchema),
    sourceType: z.enum(["DIRECT", "AI_PARSE"]),
    transform: transformSchema.optional(),
    parsingSessionId: z.uuid().optional(),
  }),
});
