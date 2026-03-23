import z from "zod";
import { addToComparisonSchema, removeFromComparisonSchema } from "./schemas";

export type AddToComparisonBody = z.infer<
  typeof addToComparisonSchema.shape.body
>;

export type RemoveFromComparisonParams = z.infer<
  typeof removeFromComparisonSchema.shape.params
>;
