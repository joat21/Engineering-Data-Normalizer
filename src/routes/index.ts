import { Router } from "express";
import importRoutes from "./import";
import importSessionsRoutes from "./importSessions";
import aiParseRoutes from "./aiParse";
import categoryRoutes from "./category";
import equipmentRoutes from "./equipment";

const router = Router();

router.use("/import", importRoutes);
router.use("/import-sessions", importSessionsRoutes);
router.use("/ai-parse", aiParseRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/categories", categoryRoutes);

export default router;
