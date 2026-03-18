import { addItemsToStaging, createSession } from "../services/ImportService";
import { importRowsSchema, initImportSchema } from "../schemas/import";
import { HandlerFromSchema } from "../types/zod";

export const initImportHandler: HandlerFromSchema<
  typeof initImportSchema
> = async (req, res, next) => {
  try {
    const { categoryId, sourceType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sessionId = await createSession({
      categoryId,
      sourceType,
      file,
    });

    res.json({ sessionId });
  } catch (error) {
    next(error);
  }
};

export const importRowsHandler: HandlerFromSchema<
  typeof importRowsSchema
> = async (req, res, next) => {
  try {
    await addItemsToStaging({
      sessionId: req.params.sessionId,
      rows: req.body.rows,
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
