import z from "zod";
import { projectBodySchema, upsertProjectItemSchema } from "./schemas";

export type Project = z.infer<typeof projectBodySchema> & {
  id: string;
  isArchived: boolean;
};

export type UpsertProjectItemParams = z.infer<
  typeof upsertProjectItemSchema.shape.params
>;
export type UpsertProjectItemBody = z.infer<
  typeof upsertProjectItemSchema.shape.body
>;
