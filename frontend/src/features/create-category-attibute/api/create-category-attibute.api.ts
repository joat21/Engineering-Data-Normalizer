import { api } from "@/shared/api/base";
import type {
  CreateCategoryAttributeBody,
  CreateCategoryAttributeParams,
} from "@engineering-data-normalizer/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createCategoryAttribute = (
  data: CreateCategoryAttributeParams & CreateCategoryAttributeBody,
) => api.post(`/categories/${data.id}/attributes`, data).then((r) => r.data);

export const useCreateCategoryAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryAttribute,
    onSuccess: (_data, variables) => {
      const categoryId = variables.id;

      queryClient.invalidateQueries({
        queryKey: ["category-with-attributes", categoryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", categoryId, "attributes"],
      });
    },
    meta: {
      successMessage: "Атрибут добавлен",
    },
  });
};
