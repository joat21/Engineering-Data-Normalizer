import { RequestHandler } from "express";
import {
  addToComparisonSchema,
  removeFromComparisonSchema,
} from "@engineering-data-normalizer/shared";
import {
  addToComparison,
  getComparisonTable,
  removeFromComparison,
} from "../services/ComparisonService";
import { HandlerFromSchema } from "../types/zod";

export const addToComparisonHandler: HandlerFromSchema<
  typeof addToComparisonSchema
> = async (req, res, next) => {
  try {
    const result = await addToComparison(req.user?.id!, req.body.equipmentId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const removeFromComparisonHandler: HandlerFromSchema<
  typeof removeFromComparisonSchema
> = async (req, res, next) => {
  try {
    const result = await removeFromComparison(req.params.itemId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getComparisonTableHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const result = await getComparisonTable(req.user?.id!);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
