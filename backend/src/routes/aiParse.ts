import { Router } from "express";
import { validate } from "../middleware/validate";
import * as NormalizationController from "../controllers/NormalizationController";
import {
  aiParseSchema,
  editAiParseResultsSchema,
  saveAiParseSchema,
} from "../schemas/ai";

const router = Router();

router.post(
  "/",
  validate(aiParseSchema),
  NormalizationController.applyAiParseHandler,
);

router.patch(
  "/:sessionId",
  validate(editAiParseResultsSchema),
  NormalizationController.editAiParseResultsHandler,
);

router.post(
  "/:sessionId/commit",
  validate(saveAiParseSchema),
  NormalizationController.saveAiParseHandler,
);

export default router;
