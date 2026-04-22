import z from "zod";
import { createManufacturerSchema, createSupplierSchema } from "./schemas";

export type CreateManufacturerBody = z.infer<
  typeof createManufacturerSchema.shape.body
>;
export type CreateSupplierBody = z.infer<
  typeof createSupplierSchema.shape.body
>;

export interface Manufacturer {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  rate: number;
}
