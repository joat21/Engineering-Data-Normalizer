import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CreateSupplierBody,
  Supplier,
} from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getSuppliers = () =>
  api.get<Supplier[]>("/reference-data/suppliers").then((r) => r.data);

export const useSuppliers = () =>
  useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });

export const createSupplier = (data: CreateSupplierBody) =>
  api.post<Supplier>("/reference-data/suppliers", data).then((r) => r.data);

export const useCreateSupplierMutation = () =>
  useMutation({
    mutationKey: ["suppliers", "create"],
    mutationFn: createSupplier,
  });
