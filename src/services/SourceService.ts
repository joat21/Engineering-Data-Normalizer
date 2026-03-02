import { SourceType } from "../generated/prisma/enums";
import { prisma } from "../../prisma/prisma";
import { Prisma } from "../generated/prisma/client";

export const createSource = async (
  data: {
    fileName: string;
    url: string;
    type: SourceType;
  },
  tx?: Prisma.TransactionClient,
) => {
  const client = tx ?? prisma;
  return await client.source.create({
    data,
  });
};
