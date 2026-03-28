import { useQuery } from "@tanstack/react-query";
import type { CategoryFilter } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getCategoryFilters = (categoryId: string) =>
  api
    .get<CategoryFilter[]>(`/categories/${categoryId}/filters`)
    .then((r) => r.data);

export const useCategoryFilters = (categoryId: string) =>
  useQuery({
    queryKey: ["categories", categoryId, "filters"],
    queryFn: () => getCategoryFilters(categoryId),
  });
