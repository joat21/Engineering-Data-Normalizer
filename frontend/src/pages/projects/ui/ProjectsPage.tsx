import { useProjects } from "@/entities/project";
import { AppLink } from "@/shared/ui";
import { Spinner } from "@heroui/react";
import { ProjectCard } from "./ProjectCard";

export const ProjectsPage = () => {
  const { data: projects, isPending } = useProjects();

  if (isPending) return <Spinner />;

  return (
    <div className="flex flex-col gap-3">
      <h1>Проекты</h1>
      {!projects?.length && <p>Проекты не найдены</p>}
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>
            <AppLink key={project.id} to={project.id}>
              <ProjectCard project={project} />
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
