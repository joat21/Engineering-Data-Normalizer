import { ApiError } from "../../exceptions/api-error";
import { prisma } from "../../prisma";

export const getManufacturers = () =>
  prisma.manufacturer.findMany({
    orderBy: { name: "asc" },
  });

export const createManufacturer = async (name: string) => {
  const existingManufacturer = await prisma.manufacturer.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existingManufacturer) {
    throw ApiError.BadRequest(
      `Производитель с названием "${existingManufacturer.name}" уже существует`,
    );
  }

  return prisma.manufacturer.create({
    data: { name },
  });
};

export const getSuppliers = () =>
  prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

export const createSupplier = async (name: string) => {
  const existingSupplier = await prisma.supplier.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (existingSupplier) {
    throw ApiError.BadRequest(
      `Поставщик с названием "${existingSupplier.name}" уже существует`,
    );
  }

  return prisma.supplier.create({
    data: { name },
  });
};

export const getCurrencies = () =>
  prisma.currency.findMany({ orderBy: { name: "asc" } });
