import z from "zod";

export const createManufacturerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});
