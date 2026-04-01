import { useQuery } from "@tanstack/react-query";
import type {
  Category,
  CategoryWithAttributes,
  GetCategoryWithAttributesParams,
} from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getCategories = () =>
  api.get<Category[]>("/categories").then((r) => r.data);

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

export const getCategoryWithAttributes = (
  data: GetCategoryWithAttributesParams,
) =>
  api.get<CategoryWithAttributes>(`/categories/${data.id}`).then((r) => r.data);

export const useCategory = (data: GetCategoryWithAttributesParams) =>
  useQuery({
    queryKey: ["category-with-attributes", data.id],
    queryFn: () => getCategoryWithAttributes(data),
    enabled: !!data.id,
  });
