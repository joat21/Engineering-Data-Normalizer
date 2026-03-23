import { z } from "zod";
import { loginSchema } from "./schemas";

export type LoginInput = z.infer<typeof loginSchema.shape.body>;
