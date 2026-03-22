import { RequestHandler } from "express";
import { HandlerFromSchema } from "../types/zod";
import {
  getCategoryAttributesSchema,
  getCategoryFiltersSchema,
} from "../schemas/category";
import {
  getCategories,
  getCategoryAttributes,
  getCategoryFilters,
} from "../services/CategoryService/service";

export const getCategoriesHandler: RequestHandler = async (_req, res, next) => {
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
    const filters = await getCategoryFilters(req.params.id);

    res.json(filters);
  } catch (error) {
    next(error);
  }
};

export const getCategoryAttributesHandler: HandlerFromSchema<
  typeof getCategoryAttributesSchema
> = async (req, res, next) => {
  try {
    const attributes = await getCategoryAttributes(req.params.id);

    res.json(attributes);
  } catch (error) {
    next(error);
  }
};
