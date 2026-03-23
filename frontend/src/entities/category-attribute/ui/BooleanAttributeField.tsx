import { Checkbox, Label } from "@heroui/react";
import type { BooleanFieldProps } from "../model/types";

export const BooleanAttributeField = ({
  attributeKey,
  label,
}: BooleanFieldProps) => {
  return (
    <Checkbox key={attributeKey} name={attributeKey}>
      <Label>{label}</Label>
    </Checkbox>
  );
};
