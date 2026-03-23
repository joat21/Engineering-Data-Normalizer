import { DataType } from "@engineering-data-normalizer/shared";
import { StringAttributeField } from "./StringAttributeField";
import { NumberAttributeField } from "./NumberAttributeField";
import { BooleanAttributeField } from "./BooleanAttributeField";
import type { AttributeFieldProps } from "../model/types";

export const AttributeField = (props: AttributeFieldProps) => {
  switch (props.dataType) {
    case DataType.STRING:
      return (
        <StringAttributeField
          attributeKey={props.attributeKey}
          label={props.label}
          options={props.options}
        />
      );

    case DataType.NUMBER:
      return (
        <NumberAttributeField
          attributeKey={props.attributeKey}
          label={props.label}
          unit={props.unit}
          options={props.options}
        />
      );

    case DataType.BOOLEAN:
      return (
        <BooleanAttributeField
          attributeKey={props.attributeKey}
          label={props.label}
        />
      );

    default:
      const _exhaustive: never = props;
      return _exhaustive;
  }
};
