import { prisma } from "../../prisma/prisma";
import { SourceType } from "../generated/prisma/enums";
import { createSource } from "./SourceService";

export const createSession = async (data: {
  categoryId: string;
  fileData: { fileName: string; url: string };
}) => {
  return await prisma.$transaction(async (tx) => {
    const source = await createSource(
      {
        ...data.fileData,
        type: SourceType.CATALOG,
      },
      tx,
    );

    const session = await tx.importSession.create({
      data: {
        categoryId: data.categoryId,
        sourceId: source.id,
      },
    });

    return session.id;
  });
};
