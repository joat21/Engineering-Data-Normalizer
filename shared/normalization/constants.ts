import { DataType } from "../category";

export const SYSTEM_FIELDS_CONFIG = {
  name: { label: "Название", type: DataType.STRING },
  manufacturer: { label: "Производитель", type: DataType.STRING },
  article: { label: "Артикул", type: DataType.STRING },
  model: { label: "Модель", type: DataType.STRING },
  externalCode: { label: "Код", type: DataType.STRING },
  price: { label: "Цена", type: DataType.NUMBER },
} as const;

export const SYSTEM_FIELD_KEYS = Object.keys(SYSTEM_FIELDS_CONFIG) as Array<
  keyof typeof SYSTEM_FIELDS_CONFIG
>;
