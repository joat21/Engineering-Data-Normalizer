import {
  DataType as PrismaDataType,
  ImportStatus,
  Equipment,
} from "../generated/prisma/client";

export type EquipmentSystemFields = Pick<
  Equipment,
  "name" | "manufacturer" | "article" | "model" | "externalCode" | "price"
>;

export type DataType = PrismaDataType;

export type ImportSessionStatus = ImportStatus;
