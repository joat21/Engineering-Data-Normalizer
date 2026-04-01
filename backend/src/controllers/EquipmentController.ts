import {
  createEquipmentSchema,
  getEquipmentTableSchema,
  createEquipmentFromStagingSchema,
  getEquipmentDetailsSchema,
} from "@engineering-data-normalizer/shared";
import { recalculateFilters } from "../services/CategoryService/recalculateFilters";
import {
  getEquipmentTable,
  createEquipmentFromStaging,
  createEquipment,
  getEquipmentDetails,
} from "../services/EquipmentService/service";
import { HandlerFromSchema } from "../types/zod";

export const createEquipmentFromStagingHandler: HandlerFromSchema<
  typeof createEquipmentFromStagingSchema
> = async (req, res, next) => {
  try {
    const result = await createEquipmentFromStaging(req.query.sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createEquipmentHandler: HandlerFromSchema<
  typeof createEquipmentSchema
> = async (req, res, next) => {
  try {
    const result = await createEquipment({ ...req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEquipmentTableHandler: HandlerFromSchema<
  typeof getEquipmentTableSchema
> = async (req, res, next) => {
  try {
    const equipmentTable = await getEquipmentTable(req.query);
    res.json(equipmentTable);
  } catch (error) {
    next(error);
  }
};

export const getEquipmentDetailsHandler: HandlerFromSchema<
  typeof getEquipmentDetailsSchema
> = async (req, res, next) => {
  try {
    const details = await getEquipmentDetails(req.params.id);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

export const _recalculateFiltersHandler: HandlerFromSchema<
  typeof getEquipmentTableSchema
> = async (req, res, next) => {
  try {
    await recalculateFilters(req.query.categoryId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
