import type { Project } from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";
import { useQuery } from "@tanstack/react-query";

export const getProjects = () =>
  api.get<Project[]>("/projects").then((r) => r.data);

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
