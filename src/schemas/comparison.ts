import z from "zod";

export const addToComparisonSchema = z.object({
  body: z.object({
    // временно передаю uuid в теле, пока нет авторизации
    userId: z.uuid(),
    equipmentId: z.uuid(),
  }),
});

export const removeFromComparisonSchema = z.object({
  params: z.object({
    itemId: z.uuid(),
  }),
});

export const getComparisonTableSchema = z.object({
  body: z.object({
    // временно передаю uuid в теле, пока нет авторизации
    userId: z.uuid(),
  }),
});
