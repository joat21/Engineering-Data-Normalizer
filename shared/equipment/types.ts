import { z } from "zod";
import { createEquipmentSchema } from "./schemas";

export type CreateEquipmentInput = z.infer<
  typeof createEquipmentSchema.shape.body
>;
