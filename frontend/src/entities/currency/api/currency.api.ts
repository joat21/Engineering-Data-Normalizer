import { useQuery } from "@tanstack/react-query";
import type { Currency } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getCurrencies = () =>
  api.get<Currency[]>("/reference-data/currencies").then((r) => r.data);

export const useCurrencies = () =>
  useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  });
