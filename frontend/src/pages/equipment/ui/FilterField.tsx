import { memo } from "react";
import { Checkbox, CheckboxGroup, Input, Label } from "@heroui/react";
import type {
  CategoryFilter,
  FilterValue,
  NumericFilterValue,
  StringFilterValue,
} from "@engineering-data-normalizer/shared";

interface FilterFieldProps {
  filter: CategoryFilter;
  value: FilterValue | undefined;
  onChange: (key: string, value: FilterValue | undefined) => void;
}

export const FilterField = memo((props: FilterFieldProps) => {
  switch (props.filter.type) {
    case "STRING":
      return <StringFilter {...props} />;
    case "NUMBER":
      return <NumberFilter {...props} />;
    case "BOOLEAN":
      return <BooleanFilter {...props} />;
    default:
      return null;
  }
});

const OptionsList = memo(({ filter, value, onChange }: FilterFieldProps) => {
  const selected = (value as StringFilterValue) || [];

  const handleChange = (values: string[]) => {
    onChange(filter.key, values);
  };

  if (filter.options.length === 0) {
    return (
      <span className="text-xs text-default-400 italic">Нет вариантов</span>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-default-200">
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
              <Label>{option}</Label>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
});

const StringFilter = memo((props: FilterFieldProps) => {
  return <OptionsList {...props} />;
});

const NumberFilter = memo(({ filter, value, onChange }: FilterFieldProps) => {
  const current = (value as NumericFilterValue) || {};

  const handleChange = (value: NumericFilterValue) => [
    onChange(filter.key, { ...current, ...value }),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={current.min?.toString() ?? ""}
          onChange={(e) =>
            handleChange({
              min: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder={`от ${filter.min ?? ""}`}
          variant="secondary"
          className="min-w-0"
          aria-label={filter.label}
        />
        <Input
          type="number"
          value={current.max?.toString() ?? ""}
          onChange={(e) =>
            handleChange({
              max: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder={`до ${filter.max ?? ""}`}
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
          <OptionsList
            filter={filter}
            value={current.options}
            onChange={(_, values) =>
              handleChange({ options: values as string[] })
            }
          />
        </div>
      )}
    </div>
  );
});

const BooleanFilter = memo(({ filter, value, onChange }: FilterFieldProps) => {
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
});
