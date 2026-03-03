import { RequestHandler } from "express";
import { addItemsToStaging, createSession } from "../services/ImportService";

interface InitImportBody {
  categoryId: string;
}

export const initImport: RequestHandler<any, any, InitImportBody> = async (
  req,
  res,
  next,
) => {
  try {
    const { categoryId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sessionId = await createSession({
      categoryId,
      file,
    });

    res.json({ sessionId });
  } catch (error) {
    next(error);
  }
};

interface ImportRowsBody {
  sessionId: string;
  rows: (string | number)[][];
}

export const importRows: RequestHandler<any, any, ImportRowsBody> = async (
  req,
  res,
  next,
) => {
  try {
    await addItemsToStaging(req.body);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
