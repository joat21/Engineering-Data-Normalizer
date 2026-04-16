import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import qs from "qs";
import type {
  EquipmentTableQuery,
  FilterValue,
} from "@engineering-data-normalizer/shared";
import { qsOptions } from "@/config";

export type FiltersState = Record<string, FilterValue>;

export const useEquipmentTableQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo<EquipmentTableQuery & { details?: string }>(() => {
    const parsed = qs.parse(searchParams.toString(), { allowDots: false });

    return {
      categoryId: String(parsed["categoryId"]),
      search: parsed["search"] ? String(parsed["search"]) : undefined,
      page: parsed["page"] ? Number(parsed["page"]) : undefined,
      limit: parsed["limit"] ? Number(parsed["limit"]) : undefined,
      sortBy: parsed["sortBy"] ? String(parsed["sortBy"]) : undefined,
      filters: (parsed["filters"] as FiltersState) || {},
      details: parsed["details"] ? String(parsed["details"]) : undefined,
    };
  }, [searchParams]);

  const updateQuery = useCallback(
    (newParams: EquipmentTableQuery & { details?: string }) => {
      const nextQuery = {
        ...query,
        ...newParams,
      };

      setSearchParams(qs.stringify(nextQuery, qsOptions));
    },
    [query, setSearchParams],
  );

  return { query, updateQuery };
};
