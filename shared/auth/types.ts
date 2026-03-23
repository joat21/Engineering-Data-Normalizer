import { z } from "zod";
import { loginSchema } from "./schemas";

export type LoginBody = z.infer<typeof loginSchema.shape.body>;
