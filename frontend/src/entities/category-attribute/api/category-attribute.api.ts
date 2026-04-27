import type { CategoryAttribute } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";
import { useQuery } from "@tanstack/react-query";

export const getAttributesForImport = (sessionId: string) =>
  api
    .get<CategoryAttribute[]>(`/categories/${sessionId}/attributes`)
    .then((r) => r.data);

export const useAttributesForImport = (sessionId: string) =>
  useQuery({
    queryKey: ["categories", sessionId, "attributes"],
    queryFn: () => getAttributesForImport(sessionId),
    enabled: !!sessionId,
  });
