import z from "zod";

export const saveFromStagingSchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
  }),
});

export const getEquipmentTableSchema = z.object({
  query: z.object({
    categoryId: z.uuid(),
  }),
});
