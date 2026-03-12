import {
  getEquipmentTableSchema,
  saveFromStagingSchema,
} from "../schemas/equipment";
import {
  getEquipmentTable,
  saveEquipmentFromStaging,
} from "../services/EquipmentService";
import { HandlerFromSchema } from "../types/zod";

export const saveFromStagingHandler: HandlerFromSchema<
  typeof saveFromStagingSchema
> = async (req, res, next) => {
  try {
    const result = await saveEquipmentFromStaging(req.body.sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getEquipmentTableHandler: HandlerFromSchema<
  typeof getEquipmentTableSchema
> = async (req, res, next) => {
  try {
    const equipmentTable = await getEquipmentTable(req.query.categoryId);
    res.json(equipmentTable);
  } catch (error) {
    next(error);
  }
};
