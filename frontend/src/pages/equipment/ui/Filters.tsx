import { memo, useCallback, useState } from "react";
import { Accordion, Button, ScrollShadow } from "@heroui/react";
import type {
  CategoryFilter,
  FilterValue,
} from "@engineering-data-normalizer/shared";
import { ChevronDown } from "lucide-react";
import { FilterField } from "./FilterField";
import { useEquipmentTableQuery } from "../model/useEquipmentTableQuery";

interface FiltersProps {
  filters: CategoryFilter[] | undefined;
}

export const Filters = memo(({ filters }: FiltersProps) => {
  const { query, updateQuery } = useEquipmentTableQuery();
  const [draftFilters, setDraftFilters] = useState<Record<string, FilterValue>>(
    query.filters ?? {},
  );

  if (!filters?.length) return null;

  const handleFilterChange = useCallback(
    (key: string, value: FilterValue | undefined) => {
      setDraftFilters((prev) => {
        if (value === undefined) {
          const { [key]: removedKey, ...rest } = prev;
          return rest;
        }

        return { ...prev, [key]: value };
      });
    },
    [],
  );

  const handleApplyFilters = () => {
    updateQuery({
      ...query,
      filters: draftFilters,
      page: 1,
    });
  };

  const handleResetAll = () => {
    setDraftFilters({});
    updateQuery({ ...query, filters: {} });
  };

  return (
    <aside className="w-72 shrink-0 sticky top-0">
      <div className="p-4 bg-white rounded-2xl border border-default-200 shadow-sm">
        <h3 className="font-semibold mb-4 text-default-700">Фильтры</h3>
        <div className="flex flex-col gap-4">
          <ScrollShadow className="flex-1 -mx-2 px-2">
            <Accordion className="gap-2 px-0">
              {filters.map((filter) => (
                <Accordion.Item key={filter.key} aria-label={filter.label}>
                  <Accordion.Heading>
                    <Accordion.Trigger>{filter.label}</Accordion.Trigger>
                    <Accordion.Indicator>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    <FilterField
                      filter={filter}
                      value={draftFilters[filter.key]}
                      onChange={handleFilterChange}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollShadow>

          <div className="mt-4 pt-4 border-t border-default-100 flex flex-col gap-2">
            <Button onPress={handleApplyFilters}>Применить</Button>
            <Button onPress={handleResetAll} variant="secondary">
              Сбросить
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
});
