import { useMutation } from "@tanstack/react-query";
import type { CreateEquipmentInput } from "@engineering-data-normalizer/shared";
import { api } from "../../../shared/api/base";

export const createEquipment = (data: CreateEquipmentInput) =>
  api.post("/equipment", data).then((r) => r.data);

export const useCreateEquipmentMutation = () =>
  useMutation({
    mutationKey: ["equipment"],
    mutationFn: (data: CreateEquipmentInput) => createEquipment(data),
  });
