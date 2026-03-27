import { api } from "@/shared/api/base";
import type { EquipmentTableResponse } from "@engineering-data-normalizer/shared";
import { useQuery } from "@tanstack/react-query";

export const getEquipmentTable = (categoryId: string | null) =>
  api
    .get<EquipmentTableResponse>(`/equipment?categoryId=${categoryId}`)
    .then((r) => r.data);

export const useEquipmentTable = (categoryId: string | null) =>
  useQuery({
    queryKey: ["equipment", categoryId],
    queryFn: () => getEquipmentTable(categoryId),
    enabled: !!categoryId,
  });
