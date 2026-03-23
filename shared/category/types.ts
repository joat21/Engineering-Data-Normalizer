import type z from "zod";
import type {
  getCategoryAttributesSchema,
  getCategoryFiltersSchema,
} from "./schemas";
import type { MappingTargetType } from "../normalization";

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

export interface CategoryAttribute {
  id: string;
  key: string;
  type: MappingTargetType;
  label: string;
  unit: string | null;
  dataType: DataType;
  isFilterable: boolean;
  //
  options: any[];
}

export type GetCategoryFiltersParams = z.infer<
  typeof getCategoryFiltersSchema.shape.params
>;
export type GetCategoryAttributesParams = z.infer<
  typeof getCategoryAttributesSchema.shape.params
>;
