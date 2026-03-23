import {
  MappingTarget,
  MappingTargetType,
} from "@engineering-data-normalizer/shared";

export const getTargetKey = (target: MappingTarget) =>
  target.type === MappingTargetType.ATTRIBUTE ? target.id : target.field;
