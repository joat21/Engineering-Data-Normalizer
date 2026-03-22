import { TARGET_TYPE } from "../config";
import { MappingTarget } from "../services/NormalizationService/types";

export const getTargetKey = (target: MappingTarget) =>
  target.type === TARGET_TYPE.ATTRIBUTE ? target.id : target.field;
