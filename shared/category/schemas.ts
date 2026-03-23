import z from "zod";

export const getCategoryFiltersSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export const getCategoryAttributesSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});
