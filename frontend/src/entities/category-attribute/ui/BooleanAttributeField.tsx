import { Checkbox, Label } from "@heroui/react";
import type { BooleanFieldProps } from "../model/types";

export const BooleanAttributeField = ({
  attributeKey: key,
  label,
}: BooleanFieldProps) => {
  return (
    <Checkbox key={key} name={key}>
      <Label>{label}</Label>
    </Checkbox>
  );
};
