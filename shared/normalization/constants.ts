import { FieldContext, type SystemFieldMetadata } from "./types";
import { DataType } from "../category";

export const SYSTEM_FIELDS_CONFIG = {
  name: { label: "Название", type: DataType.STRING },
  manufacturerName: {
    label: "Производитель",
    type: DataType.STRING,
  },
  supplierName: { label: "Поставщик", type: DataType.STRING },
  article: { label: "Артикул", type: DataType.STRING },
  model: { label: "Модель", type: DataType.STRING },
  externalCode: { label: "Код", type: DataType.STRING },
  price: {
    label: "Цена (ориг.)",
    type: DataType.NUMBER,
    contexts: [FieldContext.STAGING, FieldContext.AI],
  },
  priceInRub: {
    label: "Цена",
    type: DataType.NUMBER,
    unit: "₽",
    contexts: [FieldContext.FILTERS, FieldContext.COMPARISON],
  },
} as const satisfies Record<string, SystemFieldMetadata>;

export const SYSTEM_FIELD_KEYS = Object.keys(SYSTEM_FIELDS_CONFIG) as Array<
  keyof typeof SYSTEM_FIELDS_CONFIG
>;
