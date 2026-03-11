import { saveFromStagingSchema } from "../schemas/equipment";
import { saveEquipmentFromStaging } from "../services/EquipmentService";
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
