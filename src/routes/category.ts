import { Router } from "express";
import { validate } from "../middleware/validate";
import * as CategoryController from "../controllers/CategoryController";
import { getCategoryFiltersSchema } from "../schemas/category";

const router = Router();

router.get("/", CategoryController.getAllHandler);
router.get(
  "/:id/filters",
  validate(getCategoryFiltersSchema),
  CategoryController.getCategoryFiltersHandler,
);

export default router;
