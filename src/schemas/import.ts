import { z } from "zod";
import { SOURCE_TYPE } from "../config";

export const initImportSchema = z.object({
  body: z.object({
    categoryId: z.uuid(),
    sourceType: z.enum(SOURCE_TYPE),
  }),
});

export const importRowsSchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
    rows: z.array(z.array(z.string().or(z.number()))),
  }),
});
