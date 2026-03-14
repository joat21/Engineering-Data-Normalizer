import { RequestHandler } from "express";
import {
  getCategories,
  getCategoryFilters,
} from "../services/EquipmentService/service";
import { HandlerFromSchema } from "../types/zod";
import { getCategoryFiltersSchema } from "../schemas/category";

export const getAllHandler: RequestHandler = async (_req, res, next) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryFiltersHandler: HandlerFromSchema<
  typeof getCategoryFiltersSchema
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filters = await getCategoryFilters(id);

    res.json(filters);
  } catch (error) {
    next(error);
  }
};
