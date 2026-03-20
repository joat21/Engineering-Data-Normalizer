import {
  addToComparisonSchema,
  getComparisonTableSchema,
  removeFromComparisonSchema,
} from "../schemas/comparison";
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
    const result = await addToComparison(req.body.userId, req.body.equipmentId);
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

export const getComparisonTableHandler: HandlerFromSchema<
  typeof getComparisonTableSchema
> = async (req, res, next) => {
  try {
    const result = await getComparisonTable(req.body.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
