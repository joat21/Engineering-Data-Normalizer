import { Router } from "express";
import { validate } from "../middleware/validate";
import * as ComparisonController from "../controllers/ComparisonController";
import {
  addToComparisonSchema,
  removeFromComparisonSchema,
} from "../schemas/comparison";

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
