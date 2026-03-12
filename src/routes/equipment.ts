import { Router } from "express";
import * as EquipmentController from "../controllers/EquipmentController";

const router = Router();

router.get("/", EquipmentController.getEquipmentTableHandler);
router.post("/save-from-staging", EquipmentController.saveFromStagingHandler);

export default router;
