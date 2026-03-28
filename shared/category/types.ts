import type z from "zod";
import type {
  getCategoryAttributesSchema,
  getCategoryFiltersSchema,
} from "./schemas";
import type { MappingTargetType, NormalizedValue } from "../normalization";

export interface Category {
  id: string;
  name: string;
}

export const DataType = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
} as const;

export type DataType = (typeof DataType)[keyof typeof DataType];

// TODO: скорее всего придется добавить options для системных полей,
// значит нужно будет id менять на optionKey = id | field
export interface AttributeOption {
  id: string;
  label: string;
  normalized: NormalizedValue;
}

export interface CategoryAttribute {
  id: string;
  key: string;
  type: MappingTargetType;
  label: string;
  unit: string | null;
  dataType: DataType;
  isFilterable: boolean;
  options: AttributeOption[];
}

export interface CategoryFilter {
  key: string;
  label: string;
  type: DataType;
  min: number | null;
  max: number | null;
  options: string[];
}

export type GetCategoryFiltersParams = z.infer<
  typeof getCategoryFiltersSchema.shape.params
>;
export type GetCategoryAttributesParams = z.infer<
  typeof getCategoryAttributesSchema.shape.params
>;
