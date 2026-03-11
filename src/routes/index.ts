import { Router } from "express";
import importRoutes from "./import";
import categoryRoutes from "./category";
import normalizationRoutes from "./normalization";
import equipmentRoutes from "./equipment";

const router = Router();

router.use("/import", importRoutes);
router.use("/categories", categoryRoutes);
router.use("/normalization", normalizationRoutes);
router.use("/equipment", equipmentRoutes);

export default router;
