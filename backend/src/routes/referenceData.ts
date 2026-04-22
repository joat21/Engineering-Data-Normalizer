import { Router } from "express";
import {
  createManufacturerSchema,
  createSupplierSchema,
} from "@engineering-data-normalizer/shared";
import { validate } from "../middleware/validate";
import * as ReferenceDataController from "../controllers/ReferenceDataController";

const router = Router();

router.get("/manufacturers", ReferenceDataController.getManufacturersHandler);

router.post(
  "/manufacturers",
  validate(createManufacturerSchema),
  ReferenceDataController.createManufacturerHandler,
);

router.get("/suppliers", ReferenceDataController.getSuppliersHandler);

router.post(
  "/suppliers",
  validate(createSupplierSchema),
  ReferenceDataController.createSupplierHandler,
);

router.get("/currencies", ReferenceDataController.getCurrenciesHandler);

export default router;
