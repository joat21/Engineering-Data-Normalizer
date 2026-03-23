import {
  AttributeTarget,
  MappingTarget,
  MappingTargetType,
} from "@engineering-data-normalizer/shared";
import { prisma } from "../prisma";
import { Prisma } from "../generated/prisma/client";
import { AttributeInfo } from "../services/NormalizationService/types";

export const getAttributeInfoMap = async (
  targets: (MappingTarget | null)[],
  tx?: Prisma.TransactionClient,
) => {
  const db = tx || prisma;

  const attrIds = targets
    .filter(
      (t): t is AttributeTarget => t?.type === MappingTargetType.ATTRIBUTE,
    )
    .map((t) => t.id);

  if (attrIds.length === 0) {
    return new Map<string, AttributeInfo>();
  }

  const attributes = await db.categoryAttribute.findMany({
    where: { id: { in: attrIds } },
    select: { id: true, dataType: true, label: true },
  });

  return new Map<string, AttributeInfo>(
    attributes.map((a) => [a.id, { dataType: a.dataType, label: a.label }]),
  );
};
