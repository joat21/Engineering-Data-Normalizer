import { Router } from "express";
import * as EquipmentController from "../controllers/EquipmentController";
import { validate } from "../middleware/validate";
import {
  getEquipmentTableSchema,
  saveFromStagingSchema,
} from "../schemas/equipment";

const router = Router();

router.get(
  "/",
  validate(getEquipmentTableSchema),
  // вынужденный каст из за конфликта типа ParsedQs и схемы валидации
  EquipmentController.getEquipmentTableHandler as any,
);
router.post(
  "/staging/save",
  validate(saveFromStagingSchema),
  EquipmentController.saveFromStagingHandler,
);
router.post("/recalc", EquipmentController._recalculateFiltersHandler);

export default router;
