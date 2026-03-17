import { Router } from "express";
import { validate } from "../middleware/validate";
import {
  mapColToAttrSchema,
  applyTransformSchema,
  normalizeSingleEntitySchema,
} from "../schemas/normalization";
import * as NormalizationController from "../controllers/NormalizationController";
import {
  aiParseSchema,
  editAiParseResultsSchema,
  saveAiParseSchema,
} from "../schemas/ai";

const router = Router();

router.patch(
  "/map-col-to-attr",
  validate(mapColToAttrSchema),
  NormalizationController.mapColToAttrHandler,
);
router.patch(
  "/apply-transform",
  validate(applyTransformSchema),
  NormalizationController.applyTransformHandler,
);
router.post(
  "/ai-parse",
  validate(aiParseSchema),
  NormalizationController.applyAiParseHandler,
);
router.post(
  "/ai-parse/save",
  validate(saveAiParseSchema),
  NormalizationController.saveAiParseHandler,
);
router.patch(
  "/ai-parse/:sessionId",
  validate(editAiParseResultsSchema),
  NormalizationController.editAiParseResultsHandler,
);
router.post(
  "/single-entity",
  validate(normalizeSingleEntitySchema),
  NormalizationController.normalizeSingleEntityHandler,
);

export default router;
