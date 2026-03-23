import type { LoginBody } from "@engineering-data-normalizer/shared";
import { api } from "../../../shared/api/base";
import { useMutation } from "@tanstack/react-query";

export const login = async (data: LoginBody) =>
  api.post("/auth/login", data).then((res) => res.data);

export const useLoginMutation = () =>
  useMutation({
    mutationKey: ["auth"],
    mutationFn: (data: LoginBody) => login(data),
  });
