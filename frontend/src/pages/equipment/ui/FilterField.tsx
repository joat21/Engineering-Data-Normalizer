import { Checkbox, CheckboxGroup, Input, Label } from "@heroui/react";
import type { CategoryFilter } from "@engineering-data-normalizer/shared";

interface FilterFieldProps {
  filter: CategoryFilter;
}

export const FilterField = ({ filter }: FilterFieldProps) => {
  console.log(filter.label, "render");
  switch (filter.type) {
    case "STRING":
      return <StringFilter filter={filter} />;
    case "NUMBER":
      return <NumberFilter filter={filter} />;
    case "BOOLEAN":
      return <BooleanFilter filter={filter} />;
    default:
      return null;
  }
};

const OptionsList = ({ filter }: FilterFieldProps) => {
  if (filter.options.length === 0) {
    return (
      <span className="text-xs text-default-400 italic">Нет вариантов</span>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-default-200">
      <CheckboxGroup aria-label={filter.label}>
        {filter.options.map((option) => (
          <Checkbox key={option} value={option} variant="secondary">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label>{option}</Label>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
};

const StringFilter = ({ filter }: FilterFieldProps) => {
  return <OptionsList filter={filter} />;
};

const NumberFilter = ({ filter }: FilterFieldProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={`от ${filter.min?.toString()}`}
          variant="secondary"
          className="min-w-0"
          aria-label={filter.label}
        />
        <Input
          type="number"
          placeholder={`до ${filter.max?.toString()}`}
          variant="secondary"
          className="min-w-0"
          aria-label={filter.label}
        />
      </div>

      {filter.options.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase text-default-400 font-bold">
            Значения
          </p>
          <OptionsList filter={filter} />
        </div>
      )}
    </div>
  );
};

const BooleanFilter = ({ filter }: FilterFieldProps) => {
  return (
    <CheckboxGroup aria-label={filter.label}>
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
};
