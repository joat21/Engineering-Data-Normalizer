import z from "zod";
import { createManufacturerSchema, createSupplierSchema } from "./schemas";

export type CreateManufacturerBody = z.infer<
  typeof createManufacturerSchema.shape.body
>;
export type CreateSupplierBody = z.infer<
  typeof createSupplierSchema.shape.body
>;
