import {
  DataType,
  MappingTargetType,
  SYSTEM_FIELDS_CONFIG,
} from "@engineering-data-normalizer/shared";
import { prisma } from "../../prisma";
import { getAttributeOptionsMap } from "../../helpers/getAttributeOptionsMap";
import { booleanNormalizationOptions } from "../NormalizationService/config";

export const getCategories = async () => await prisma.category.findMany();

export const getCategoryFilters = async (categoryId: string) => {
  const categoryFilters = await prisma.categoryFilter.findMany({
    where: { categoryId },
  });

  return categoryFilters.map((filter) => ({
    key: filter.systemField || `attr_${filter.attributeId}`,
    label: filter.label,
    type: filter.type,
    min: filter.minValue,
    max: filter.maxValue,
    options: filter.options,
  }));
};

export const getCategoryAttributes = async (categoryId: string) => {
  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: { categoryId },
  });

  const stringAttrIds = categoryAttributes
    .filter((attr) => attr.dataType === DataType.STRING)
    .map((attr) => attr.id);

  const optionsMap = await getAttributeOptionsMap(stringAttrIds);

  const systemFields = Object.entries(SYSTEM_FIELDS_CONFIG).map(
    ([key, config]) => ({
      id: key,
      key: key,
      type: MappingTargetType.SYSTEM,
      label: config.label,
      unit: null,
      dataType: config.type,
      isFilterable: true,
      options: [],
    }),
  );

  const attributes = categoryAttributes.map((attr) => {
    const { categoryId, ...rest } = attr;
    let options = optionsMap.get(attr.id) || [];

    // Подмешиваем дефолтные булевы значения
    if (attr.dataType === DataType.BOOLEAN && options.length === 0) {
      options = booleanNormalizationOptions;
    }

    return {
      ...rest,
      type: MappingTargetType.ATTRIBUTE,
      options,
    };
  });

  return [...systemFields, ...attributes];
};
