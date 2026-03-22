import { Router } from "express";
import { validate } from "../middleware/validate";
import * as CategoryController from "../controllers/CategoryController";
import {
  getCategoryAttributesSchema,
  getCategoryFiltersSchema,
} from "../schemas/category";

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
