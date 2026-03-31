import { memo } from "react";
import { Checkbox, CheckboxGroup, Label } from "@heroui/react";
import type { StringFilterValue } from "@engineering-data-normalizer/shared";
import type { FilterFieldProps } from "../model/types";

export const OptionsList = memo(
  ({ filter, value, onChange }: FilterFieldProps) => {
    const selected = (value as StringFilterValue) || [];

    const handleChange = (values: string[]) => {
      onChange(filter.key, values);
    };

    if (filter.options.length === 0) {
      return <span className="text-sm italic">Нет вариантов</span>;
    }

    return (
      <div className="max-h-48 overflow-y-auto">
        <CheckboxGroup
          value={selected}
          onChange={(values) => handleChange(values)}
          aria-label={filter.label}
        >
          {filter.options.map((option) => (
            <Checkbox key={option} variant="secondary" value={option}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label className="font-normal">{option}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    );
  },
);
