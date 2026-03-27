import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateManufacturerBody,
  Manufacturer,
} from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getManufacturers = () =>
  api.get<Manufacturer[]>("/reference-data/manufacturers").then((r) => r.data);

export const useManufacturers = () =>
  useQuery({
    queryKey: ["manufacturers"],
    queryFn: getManufacturers,
  });

export const createManufacturer = (data: CreateManufacturerBody) =>
  api
    .post<Manufacturer>("/reference-data/manufacturers", data)
    .then((r) => r.data);

export const useCreateManufacturerMutation = () =>
  useMutation({
    mutationKey: ["manufacturers", "create"],
    mutationFn: createManufacturer,
  });
