import { Input, Label, TextField } from "@heroui/react";
import type { StringFieldProps } from "../model/types";

export const StringAttributeField = ({
  attributeKey,
  label,
}: StringFieldProps) => {
  return (
    <TextField key={attributeKey} name={attributeKey}>
      <Label>{label}</Label>
      <Input placeholder={label} />
    </TextField>
  );
};
