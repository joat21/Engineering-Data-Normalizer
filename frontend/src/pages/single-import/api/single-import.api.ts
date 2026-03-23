import { useMutation } from "@tanstack/react-query";
import type { CreateEquipmentBody } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const createEquipment = (data: CreateEquipmentBody) =>
  api.post("/equipment", data).then((r) => r.data);

export const useCreateEquipmentMutation = () =>
  useMutation({
    mutationKey: ["equipment"],
    mutationFn: (data: CreateEquipmentBody) => createEquipment(data),
  });
