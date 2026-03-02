import "dotenv/config";
import express, { Express } from "express";

import { upload } from "./middleware/upload";
import * as CategoryController from "./controllers/CategoryController";
import * as ImportController from "./controllers/ImportController";

const PORT = Number(process.env.PORT) || 8080;

const app: Express = express();
app.use(express.json());

app.post(
  "/api/import/init",
  upload.single("file"),
  ImportController.initImport,
);

app.get("/api/equipment/categories", CategoryController.getAll);

app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`[Server]: Server listening at http://localhost:${PORT}`);
});
