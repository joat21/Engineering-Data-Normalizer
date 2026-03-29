import { memo } from "react";
import { Checkbox, CheckboxGroup, Label } from "@heroui/react";
import type { FilterFieldProps } from "../model/types";

export const BooleanFilter = memo(
  ({ filter, value, onChange }: FilterFieldProps) => {
    const selected = value !== undefined ? [String(value)] : [];

    const handleChange = (values: string[]) => {
      if (values.length === 0 || values.length === 2) {
        onChange(filter.key, undefined);
        return;
      }

      const newValue = values[0] === "true";
      onChange(filter.key, newValue);
    };

    return (
      <CheckboxGroup
        value={selected}
        onChange={handleChange}
        aria-label={filter.label}
      >
        <Checkbox value="true" variant="secondary">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>Да</Label>
          </Checkbox.Content>
        </Checkbox>
        <Checkbox value="false" variant="secondary">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>Нет</Label>
          </Checkbox.Content>
        </Checkbox>
      </CheckboxGroup>
    );
  },
);
