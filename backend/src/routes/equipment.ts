import { Router } from "express";
import {
  createEquipmentSchema,
  getEquipmentTableSchema,
  createEquipmentFromStagingSchema,
} from "@engineering-data-normalizer/shared";
import * as EquipmentController from "../controllers/EquipmentController";
import { validate } from "../middleware/validate";

const router = Router();

router.get(
  "/",
  validate(getEquipmentTableSchema),
  // вынужденный каст из за конфликта типа ParsedQs и схемы валидации
  EquipmentController.getEquipmentTableHandler as any,
);

router.post(
  "/staging",
  validate(createEquipmentFromStagingSchema),
  EquipmentController.createEquipmentFromStagingHandler,
);

router.post(
  "/",
  validate(createEquipmentSchema),
  EquipmentController.createEquipmentHandler,
);

router.post("/recalc", EquipmentController._recalculateFiltersHandler);

export default router;
