import { Router } from "express";
import {
  addToComparisonSchema,
  removeFromComparisonSchema,
} from "@engineering-data-normalizer/shared";
import { validate } from "../middleware/validate";
import * as ComparisonController from "../controllers/ComparisonController";

const router = Router();

router.post(
  "/",
  validate(addToComparisonSchema),
  ComparisonController.addToComparisonHandler,
);

router.delete(
  "/:itemId",
  validate(removeFromComparisonSchema),
  ComparisonController.removeFromComparisonHandler,
);

router.get("/", ComparisonController.getComparisonTableHandler);

export default router;
