import { z } from "zod";
import { normalizedDataSchema } from "../normalization";

export const createEquipmentSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    normalizedData: z.array(normalizedDataSchema),
  }),
});
