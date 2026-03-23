import { z } from "zod";
import { DataType } from "../category";

export const MappingTargetType = {
  SYSTEM: "SYSTEM",
  ATTRIBUTE: "ATTRIBUTE",
} as const;

export type MappingTargetType =
  (typeof MappingTargetType)[keyof typeof MappingTargetType];

type EquipmentSystemFields = {
  name: string | null;
  manufacturer: string | null;
  article: string | null;
  model: string | null;
  externalCode: string | null;
  price: Number;
};

export const SYSTEM_FIELDS_CONFIG = {
  name: { label: "Название", type: DataType.STRING },
  manufacturer: { label: "Производитель", type: DataType.STRING },
  article: { label: "Артикул", type: DataType.STRING },
  model: { label: "Модель", type: DataType.STRING },
  externalCode: { label: "Код", type: DataType.STRING },
  price: { label: "Цена", type: DataType.NUMBER },
} as const satisfies Record<
  keyof EquipmentSystemFields,
  { label: string; type: DataType }
>;

export const SYSTEM_FIELD_KEYS = Object.keys(SYSTEM_FIELDS_CONFIG) as Array<
  keyof typeof SYSTEM_FIELDS_CONFIG
>;

export const normalizedValueSchema = z.object({
  valueString: z.string(),
  valueMin: z.number().optional(),
  valueMax: z.number().optional(),
  valueArray: z.array(z.number()).optional(),
  valueBoolean: z.boolean().optional(),
});

export const systemTargetSchema = z.object({
  type: z.literal(MappingTargetType.SYSTEM),
  field: z.enum(SYSTEM_FIELD_KEYS),
});
export const attributeTargetSchema = z.object({
  type: z.literal(MappingTargetType.ATTRIBUTE),
  id: z.uuid(),
});

export const mappingTargetSchema = z.discriminatedUnion("type", [
  systemTargetSchema,
  attributeTargetSchema,
]);

export const normalizedDataSchema = z.object({
  target: mappingTargetSchema,
  rawValue: z.string(),
  normalized: normalizedValueSchema,
});
