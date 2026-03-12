import { DATA_TYPE } from "../../config";
import { DataType, EquipmentSystemFields } from "../../types";

export const SYSTEM_FIELDS_CONFIG = {
  name: { label: "Название", type: DATA_TYPE.STRING },
  manufacturer: { label: "Производитель", type: DATA_TYPE.STRING },
  article: { label: "Артикул", type: DATA_TYPE.STRING },
  model: { label: "Модель", type: DATA_TYPE.STRING },
  externalCode: { label: "Код", type: DATA_TYPE.STRING },
  price: { label: "Цена", type: DATA_TYPE.NUMBER },
} as const satisfies Record<
  keyof EquipmentSystemFields,
  { label: string; type: DataType }
>;

export const FIELD_MAP: Record<string, string> = {
  STRING: "valueString",
  BOOLEAN: "valueBoolean",
};
