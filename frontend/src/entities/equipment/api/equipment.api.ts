import { keepPreviousData, useQuery } from "@tanstack/react-query";
import qs from "qs";
import type {
  EquipmentDetailResponse,
  EquipmentTableResponse,
  GetEquipmentDetailsParams,
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

export const getEquipmentDetails = (data: GetEquipmentDetailsParams) =>
  api.get<EquipmentDetailResponse>(`/equipment/${data.id}`).then((r) => r.data);

export const useEquipmentDetails = (data: GetEquipmentDetailsParams) =>
  useQuery({
    queryKey: ["equipment", data.id],
    queryFn: () => getEquipmentDetails(data),
    enabled: !!data.id,
  });
