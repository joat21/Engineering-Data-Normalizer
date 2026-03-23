import { z } from "zod";
import {
  attributeTargetSchema,
  normalizedDataSchema,
  normalizedValueSchema,
  systemTargetSchema,
} from "./schemas";

export type NormalizedValue = z.infer<typeof normalizedValueSchema>;
export type NormalizedData = z.infer<typeof normalizedDataSchema>;

export type SystemTarget = z.infer<typeof systemTargetSchema>;
export type AttributeTarget = z.infer<typeof attributeTargetSchema>;
export type MappingTarget = SystemTarget | AttributeTarget;
