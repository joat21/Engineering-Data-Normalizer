import { api } from "@/shared/api/base";
import type {
  CreateCategoryAttributeBody,
  CreateCategoryAttributeParams,
} from "@engineering-data-normalizer/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createCategoryAttribute = (
  data: CreateCategoryAttributeParams & CreateCategoryAttributeBody,
) => {
  console.log(data);
  return api
    .post(`/categories/${data.id}/attributes`, data)
    .then((r) => r.data);
};

export const useCreateCategoryAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryAttribute,
    onSuccess: (_data, variables) => {
      const sessionId = variables.sessionId;

      queryClient.invalidateQueries({
        queryKey: ["category-with-attributes", sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", sessionId, "attributes"],
      });
    },
    meta: {
      successMessage: "Атрибут добавлен",
    },
  });
};
