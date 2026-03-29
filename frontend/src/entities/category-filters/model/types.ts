import type {
  CategoryFilter,
  FilterValue,
} from "@engineering-data-normalizer/shared";

export interface FilterFieldProps {
  filter: CategoryFilter;
  value: FilterValue | undefined;
  onChange: (key: string, value: FilterValue | undefined) => void;
}
