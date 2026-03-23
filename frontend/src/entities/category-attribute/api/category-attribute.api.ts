import type { CategoryAttribute } from "@engineering-data-normalizer/shared";
import { api } from "../../../shared/api/base";
import { useQuery } from "@tanstack/react-query";

export const getCategoryAttributes = (categoryId: string) =>
  api
    .get<CategoryAttribute[]>(`/categories/${categoryId}/attributes`)
    .then((r) => r.data);

export const useCategoryAttributes = (categoryId: string) =>
  useQuery({
    queryKey: ["categories", categoryId, "attributes"],
    queryFn: () => getCategoryAttributes(categoryId),
    enabled: !!categoryId,
  });
