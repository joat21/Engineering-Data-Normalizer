import {
  getSystemFields,
  MappingTargetType,
  SystemFieldMetadata,
  SystemFieldsConfig,
} from "@engineering-data-normalizer/shared";
import { prisma } from "../../prisma";

export const transformSystemFieldsToAttributes = (
  fieldsConfig: Partial<SystemFieldsConfig>,
) => {
  return Object.entries(fieldsConfig).map(([key, config]) => {
    return {
      id: key,
      key: key,
      type: MappingTargetType.SYSTEM,
      label: config.label,
      unit: config.unit,
      dataType: config.type,
      isFilterable: true,
      options: [],
    };
  });
};

export const checkIsLabelExist = async (categoryId: string, label: string) => {
  for (const value of Object.values(getSystemFields())) {
    const config = value as SystemFieldMetadata;

    if (config.label.toLowerCase() === label.toLowerCase()) {
      return true;
    }
  }

  const existingAttribute = await prisma.categoryAttribute.findFirst({
    where: {
      categoryId,
      label,
    },
  });

  if (existingAttribute?.label.toLowerCase() === label.toLowerCase()) {
    return true;
  }

  return false;
};
