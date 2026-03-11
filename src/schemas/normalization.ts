import { z } from "zod";

export const transformSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("EXTRACT_NUMBERS") }),
  z.object({
    type: z.literal("SPLIT_BY"),
    payload: z.object({ separator: z.string() }),
  }),
  z.object({
    type: z.literal("MULTIPLY"),
    payload: z.object({ factor: z.number() }),
  }),
]);

export type TransformConfig = z.infer<typeof transformSchema>;

const mappingTargetSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("system"),
    field: z.enum([
      "name",
      "article",
      "model",
      "externalCode",
      "price",
      "manufacturer",
    ]),
  }),
  z.object({ type: z.literal("attribute"), id: z.uuid() }),
]);

export type MappingTarget = z.infer<typeof mappingTargetSchema>;

export const applyTransformSchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
    colIndex: z.number(),
    transform: transformSchema,
    targets: z.array(mappingTargetSchema.nullable()),
  }),
});

export const mapColToAttrSchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
    colIndex: z.number(),
    target: mappingTargetSchema,
  }),
});
