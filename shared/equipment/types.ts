import { z } from "zod";
import {
  booleanFilterValueSchema,
  filterValueSchema,
  numericFilterValueSchema,
  stringFilterValueSchema,
  createEquipmentSchema,
  createEquipmentFromStagingSchema,
  getEquipmentTableSchema,
} from "./schemas";
import type { MappingTargetType } from "../normalization";

export type CreateEquipmentBody = z.infer<
  typeof createEquipmentSchema.shape.body
>;

export type CreateEquipmentFromStagingQuery = z.infer<
  typeof createEquipmentFromStagingSchema.shape.query
>;

export type NumericFilterValue = z.infer<typeof numericFilterValueSchema>;
export type StringFilterValue = z.infer<typeof stringFilterValueSchema>;
export type BooleanFilterValue = z.infer<typeof booleanFilterValueSchema>;
export type FilterValue = z.infer<typeof filterValueSchema>;

export interface EquipmentHeader {
  key: string;
  label: string;
  type: MappingTargetType;
}

export interface EquipmentRow {
  id: string;
  [key: string]: string | number | boolean | null;
}

export interface EquipmentTableResponse {
  headers: EquipmentHeader[];
  rows: EquipmentRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GetEquipmentTableQuery = z.infer<
  typeof getEquipmentTableSchema.shape.query
>;
