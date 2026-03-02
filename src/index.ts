import "dotenv/config";
import express, { Express } from "express";

import * as CategoryController from './controllers/CategoryController';

const PORT = 8080;

const app: Express = express();

app.get("/api/equipment/categories", CategoryController.getAll);

app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    return console.error(error);
  }

  console.log(`[Server]: Server listening at http://localhost:${PORT}`);
});
