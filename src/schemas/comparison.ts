import z from "zod";

export const addToComparisonSchema = z.object({
  body: z.object({
    equipmentId: z.uuid(),
  }),
});

export const removeFromComparisonSchema = z.object({
  params: z.object({
    itemId: z.uuid(),
  }),
});
