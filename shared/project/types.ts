import z from "zod";
import { projectBodySchema } from "./schemas";

export type Project = z.infer<typeof projectBodySchema> & {
  id: string;
  isArchived: boolean;
};
