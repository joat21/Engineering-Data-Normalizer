import { memo } from "react";
import { Input } from "@heroui/react";
import type { NumericFilterValue } from "@engineering-data-normalizer/shared";
import { OptionsList } from "./OptionsList";
import type { FilterFieldProps } from "../model/types";

export const NumberFilter = memo(
  ({ filter, value, onChange }: FilterFieldProps) => {
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
  },
);
