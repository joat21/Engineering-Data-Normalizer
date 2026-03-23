import { EquipmentSystemFields } from "../../types";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../prisma";
import {
  DataType,
  SYSTEM_FIELDS_CONFIG,
} from "@engineering-data-normalizer/shared";

export const recalculateFilters = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { attributes: { where: { isFilterable: true } } },
  });

  if (!category) throw new Error("Category not found");

  const systemFieldFilters = await Promise.all(
    Object.entries(SYSTEM_FIELDS_CONFIG).map(async ([field, config]) => {
      const systemField = field as keyof EquipmentSystemFields;

      if (config.type === DataType.NUMBER) {
        const agg = await prisma.equipment.aggregate({
          where: { categoryId },
          _min: { [systemField]: true },
          _max: { [systemField]: true },
        });

        return {
          categoryId,
          systemField,
          label: config.label,
          type: DataType.NUMBER,
          minValue: agg._min[systemField],
          maxValue: agg._max[systemField],
        };
      }

      const groups = await prisma.equipment.findMany({
        where: { categoryId, NOT: { [systemField]: null } },
        distinct: [systemField],
        select: { [systemField]: true },
      });

      return {
        categoryId,
        systemField: field,
        label: config.label,
        type: DataType.STRING,
        options: groups.map((g) => g[systemField]).filter((v) => v !== null),
      };
    }),
  );

  const attributeFilters = await Promise.all(
    category.attributes.map(async (attr) => {
      const baseFilter = {
        categoryId,
        attributeId: attr.id,
        label: attr.label,
        type: attr.dataType,
      };

      if (attr.dataType === DataType.NUMBER) {
        const [agg, groups] = await Promise.all([
          prisma.equipmentAttributeValue.aggregate({
            where: { attributeId: attr.id },
            _min: { valueMin: true },
            _max: { valueMax: true },
          }),
          prisma.equipmentAttributeValue.findMany({
            where: { attributeId: attr.id },
            distinct: ["valueString"],
            select: { valueString: true },
          }),
        ]);

        return {
          ...baseFilter,
          minValue: agg._min.valueMin,
          maxValue: agg._max.valueMax,
          options: groups.map((g) => g.valueString),
        };
      }

      if (attr.dataType === DataType.STRING) {
        const groups = await prisma.equipmentAttributeValue.findMany({
          where: { attributeId: attr.id },
          distinct: ["valueString"],
          select: { valueString: true },
        });

        return {
          ...baseFilter,
          options: groups.map((g) => g.valueString),
        };
      }

      return baseFilter;
    }),
  );

  const filterEntries: Prisma.CategoryFilterCreateManyInput[] = [
    ...systemFieldFilters,
    ...attributeFilters,
  ];

  await prisma.$transaction([
    prisma.categoryFilter.deleteMany({ where: { categoryId } }),
    prisma.categoryFilter.createMany({ data: filterEntries }),
  ]);
};
