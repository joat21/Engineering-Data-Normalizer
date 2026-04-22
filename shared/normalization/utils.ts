import { SYSTEM_FIELDS_CONFIG } from "./constants";
import type {
  FieldContext,
  SystemFieldKey,
  SystemFieldMetadata,
} from "./types";

export const getSystemFields = (context?: FieldContext) => {
  const allFields = SYSTEM_FIELDS_CONFIG as Record<
    SystemFieldKey,
    SystemFieldMetadata
  >;

  if (!context) return allFields;

  const filteredEntries = Object.entries(allFields).filter(([_, config]) => {
    // Если контексты не заданы - поле универсальное
    if (!config.contexts) return true;
    return config.contexts.includes(context);
  });

  return Object.fromEntries(filteredEntries) as Partial<
    Record<SystemFieldKey, SystemFieldMetadata>
  >;
};
