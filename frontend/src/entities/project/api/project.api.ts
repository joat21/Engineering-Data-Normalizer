import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  Project,
  UpsertProjectItemBody,
  UpsertProjectItemParams,
} from "@engineering-data-normalizer/shared";
import { api } from "@/shared/api/base";

export const getProjects = () =>
  api.get<Project[]>("/projects").then((r) => r.data);

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

export const addToProject = (
  data: UpsertProjectItemParams & UpsertProjectItemBody,
) =>
  api.post<void>(`/projects/${data.projectId}/items`, data).then((r) => r.data);

export const useAddToProjectMutation = () =>
  useMutation({
    mutationKey: ["projects", "add-item"],
    mutationFn: addToProject,
  });
