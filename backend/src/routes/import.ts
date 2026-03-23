import { Router } from "express";
import { upload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
  getStagingTableSchema,
  importRowsSchema,
  initImportSchema,
} from "@engineering-data-normalizer/shared";
import * as ImportController from "../controllers/ImportController";

const router = Router();

router.post(
  "/init",
  upload.single("file"),
  validate(initImportSchema),
  ImportController.initImportHandler,
);

router.post(
  "/:sessionId",
  validate(importRowsSchema),
  ImportController.importRowsHandler,
);

router.get(
  "/:sessionId",
  validate(getStagingTableSchema),
  ImportController.getStagingTableHandler,
);

export default router;
