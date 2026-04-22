import { prisma } from "../../prisma";

export const getManufacturers = () =>
  prisma.manufacturer.findMany({
    orderBy: { name: "asc" },
  });

export const createManufacturer = (name: string) =>
  prisma.manufacturer.create({
    data: { name },
  });

export const getSuppliers = () =>
  prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

export const createSupplier = (name: string) =>
  prisma.supplier.create({
    data: { name },
  });
