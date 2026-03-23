import { Router } from "express";
import {
  getCategoryAttributesSchema,
  getCategoryFiltersSchema,
} from "@engineering-data-normalizer/shared";
import { validate } from "../middleware/validate";
import * as CategoryController from "../controllers/CategoryController";

const router = Router();

router.get("/", CategoryController.getCategoriesHandler);

router.get(
  "/:id/filters",
  validate(getCategoryFiltersSchema),
  CategoryController.getCategoryFiltersHandler,
);

router.get(
  "/:id/attributes",
  validate(getCategoryAttributesSchema),
  CategoryController.getCategoryAttributesHandler,
);

export default router;
