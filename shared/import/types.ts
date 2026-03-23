import { z } from "zod";
import { initImportSchema } from "./schemas";

export const SourceType = {
  CATALOG: "CATALOG",
  SINGLE_ITEM: "SINGLE_ITEM",
} as const;

export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export type InitImportInput = z.infer<typeof initImportSchema.shape.body>;
