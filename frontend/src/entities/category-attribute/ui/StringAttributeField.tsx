import { Input, Label, TextField } from "@heroui/react";
import type { StringFieldProps } from "../model/types";

export const StringAttributeField = ({
  attributeKey: key,
  label,
}: StringFieldProps) => {
  return (
    <TextField key={key} name={key}>
      <Label>{label}</Label>
      <Input placeholder={label} />
    </TextField>
  );
};
