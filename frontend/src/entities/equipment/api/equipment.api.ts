import { keepPreviousData, useQuery } from "@tanstack/react-query";
import qs from "qs";
import type {
  EquipmentTableResponse,
  GetEquipmentTableQuery,
} from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";
import { qsOptions } from "@/config";

export const getEquipmentTable = (data: GetEquipmentTableQuery) =>
  api
    .get<EquipmentTableResponse>("/equipment", {
      params: data,
      paramsSerializer: (params) => qs.stringify(params, qsOptions),
    })
    .then((r) => r.data);

export const useEquipmentTable = (data: GetEquipmentTableQuery) =>
  useQuery({
    queryKey: ["equipment", data],
    queryFn: () => getEquipmentTable(data),
    enabled: !!data.categoryId,
    placeholderData: keepPreviousData,
  });
