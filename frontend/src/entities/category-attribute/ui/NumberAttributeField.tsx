import { Description, Label, NumberField } from "@heroui/react";
import type { NumberFieldProps } from "../model/types";

export const NumberAttributeField = ({
  attributeKey: key,
  label,
  unit,
}: NumberFieldProps) => {
  return (
    <div key={key} className="flex flex-col gap-1">
      <Label>
        {label} {unit}
      </Label>
      <div className="flex gap-1">
        <NumberField
          aria-label={label}
          name={`${key}_valueMin`}
          className="max-w-44"
        >
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input placeholder="Минимум" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
        <NumberField
          aria-label={label}
          name={`${key}_valueMax`}
          className="max-w-44"
        >
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input placeholder="Максимум" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>
      </div>
      <Description>
        Если значение одно - заполняйте им минимум и максимум
      </Description>
    </div>
  );
};
