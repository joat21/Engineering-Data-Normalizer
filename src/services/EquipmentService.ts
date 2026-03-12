import { v4 as uuidv4 } from "uuid";
import { prisma } from "../../prisma/prisma";
import { Prisma } from "../generated/prisma/client";
import { TransformedRow } from "./NormalizationService/types";

export const saveEquipmentFromStaging = async (sessionId: string) => {
  const session = await prisma.importSession.findUnique({
    where: { id: sessionId },
    select: { categoryId: true, sourceId: true },
  });

  if (!session) throw new Error("Session not found");

  const items = await prisma.stagingImportItem.findMany({
    where: { sessionId },
    select: { transformedRow: true },
  });

  const equipmentToCreate: Prisma.EquipmentCreateManyInput[] = [];
  const attributesToCreate: Prisma.EquipmentAttributeValueCreateManyInput[] =
    [];

  items.forEach((item) => {
    const transformedRow = item.transformedRow as unknown as TransformedRow;
    if (!transformedRow) return;

    const equipmentId = uuidv4();

    const equipmentEntry: Prisma.EquipmentCreateManyInput = {
      id: equipmentId,
      categoryId: session.categoryId,
      sourceId: session.sourceId,
      name: null,
      article: null,
      model: null,
      externalCode: null,
      manufacturer: null,
      price: new Prisma.Decimal(0),
    };

    Object.values(transformedRow)
      .flat()
      .forEach((col) => {
        const { target, normalized } = col;

        if (target.type === "system") {
          const field = target.field;

          if (field === "price") {
            equipmentEntry.price = new Prisma.Decimal(
              normalized.valueString ?? 0,
            );
          } else {
            equipmentEntry[field] = normalized.valueString;
          }
        } else {
          attributesToCreate.push({
            id: uuidv4(),
            equipmentId: equipmentId,
            attributeId: target.id,
            valueString: normalized.valueString,
            valueMin: normalized.valueMin
              ? new Prisma.Decimal(normalized.valueMin)
              : null,
            valueMax: normalized.valueMax
              ? new Prisma.Decimal(normalized.valueMax)
              : null,
            valueArray: normalized.valueArray
              ? (normalized.valueArray as any)
              : null,
            valueBoolean: normalized.valueBoolean ?? null,
          });
        }
      });

    equipmentToCreate.push(equipmentEntry);
  });

  return await prisma.$transaction(async (tx) => {
    if (equipmentToCreate.length > 0) {
      await tx.equipment.createMany({
        data: equipmentToCreate,
      });
    }

    if (attributesToCreate.length > 0) {
      await tx.equipmentAttributeValue.createMany({
        data: attributesToCreate,
      });
    }

    await tx.importSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED" },
    });

    return {
      equipmentCount: equipmentToCreate.length,
      attributesCount: attributesToCreate.length,
    };
  });
};

export const getEquipmentTable = async (categoryId: string) => {
  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: { categoryId },
    select: { id: true, label: true },
  });

  const equipment = await prisma.equipment.findMany({
    where: { categoryId },
    include: { attributes: true },
  });

  const usedAttrIds = new Set(
    equipment.flatMap((e) => e.attributes.map((a) => a.attributeId)),
  );
  const usedAttrs = categoryAttributes.filter((attr) =>
    usedAttrIds.has(attr.id),
  );

  const headers = [
    { key: "name", label: "Название", type: "system" },
    { key: "article", label: "Артикул", type: "system" },
    { key: "model", label: "Модель", type: "system" },
    { key: "manufacturer", label: "Производитель", type: "system" },
    { key: "externalCode", label: "Код", type: "system" },
    { key: "price", label: "Цена", type: "system" },
    ...usedAttrs.map((attr) => ({
      key: `attr_${attr.id}`,
      label: attr.label,
      type: "attribute",
    })),
  ];

  const rows = equipment.map((item) => {
    item.externalCode;
    const row: any = {
      id: item.id,
      article: item.article,
      model: item.model,
      name: item.name,
      manufacturer: item.manufacturer,
      externalCode: item.externalCode,
      price: item.price,
    };

    const valuesMap = new Map(item.attributes.map((a) => [a.attributeId, a]));

    usedAttrs.forEach((attr) => {
      const val = valuesMap.get(attr.id);
      row[`attr_${attr.id}`] = val ? val.valueString : null;
    });

    return row;
  });

  return { headers, rows };
};

export const getCategories = async () => await prisma.category.findMany();
