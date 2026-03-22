import { SYSTEM_FIELDS_CONFIG, TARGET_TYPE } from "../../config";
import { AttributeInfo, MappingTarget } from "../NormalizationService/types";

export const getTargetLabel = (
  target: MappingTarget,
  attributeInfoMap: Map<string, AttributeInfo>,
): string => {
  if (target.type === TARGET_TYPE.SYSTEM) {
    return SYSTEM_FIELDS_CONFIG[target.field]?.label || target.field;
  }
  return attributeInfoMap.get(target.id)?.label || `Атрибут ${target.id}`;
};
