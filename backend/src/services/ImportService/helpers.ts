import {
  MappingTarget,
  MappingTargetType,
  SYSTEM_FIELDS_CONFIG,
} from "@engineering-data-normalizer/shared";
import { AttributeInfo } from "../NormalizationService/types";

export const getTargetLabel = (
  target: MappingTarget,
  attributeInfoMap: Map<string, AttributeInfo>,
): string => {
  if (target.type === MappingTargetType.SYSTEM) {
    return SYSTEM_FIELDS_CONFIG[target.field]?.label || target.field;
  }
  return attributeInfoMap.get(target.id)?.label || `Атрибут ${target.id}`;
};
