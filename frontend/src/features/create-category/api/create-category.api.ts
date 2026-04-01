import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCategoryBody } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const createCategory = (data: CreateCategoryBody) =>
  api.post("/categories", data).then((r) => r.data);

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};
