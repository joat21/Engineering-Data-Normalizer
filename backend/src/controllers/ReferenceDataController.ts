import { RequestHandler } from "express";
import {
  createManufacturerSchema,
  createSupplierSchema,
} from "@engineering-data-normalizer/shared";
import {
  createManufacturer,
  createSupplier,
  getCurrencies,
  getManufacturers,
  getSuppliers,
} from "../services/ReferenceDataService/service";
import { HandlerFromSchema } from "../types/zod";

export const getManufacturersHandler: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const manufacturers = await getManufacturers();
    res.json(manufacturers);
  } catch (error) {
    next(error);
  }
};

export const createManufacturerHandler: HandlerFromSchema<
  typeof createManufacturerSchema
> = async (req, res, next) => {
  try {
    const result = await createManufacturer(req.body.name);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getSuppliersHandler: RequestHandler = async (_req, res, next) => {
  try {
    const suppliers = await getSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const createSupplierHandler: HandlerFromSchema<
  typeof createSupplierSchema
> = async (req, res, next) => {
  try {
    const result = await createSupplier(req.body.name);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCurrenciesHandler: RequestHandler = async (_req, res, next) => {
  try {
    const currencies = await getCurrencies();
    res.json(currencies);
  } catch (error) {
    next(error);
  }
};
