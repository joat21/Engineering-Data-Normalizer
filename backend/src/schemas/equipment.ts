import z from "zod";
import { normalizedDataSchema } from "./normalization";

export const createEquipmentFromStagingSchema = z.object({
  query: z.object({
    sessionId: z.uuid(),
  }),
});

export const createEquipmentSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    normalizedData: z.array(normalizedDataSchema),
  }),
});

export const stringFilterValueSchema = z.array(z.string());
export const booleanFilterValueSchema = z.coerce.boolean();
export const numericFilterValueSchema = z.object({
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  options: z.array(z.string()).optional(),
});

export const filterValueSchema = z.union([
  numericFilterValueSchema,
  stringFilterValueSchema,
  booleanFilterValueSchema,
]);

export const getEquipmentTableSchema = z.object({
  query: z.object({
    categoryId: z.uuid(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    sortBy: z.string().optional(),
    filters: z.record(z.string(), filterValueSchema).optional(),
  }),
});
