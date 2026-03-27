import type { Project } from "@engineering-data-normalizer/shared";
import { Card } from "@heroui/react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { name, description, isArchived } = project;

  return (
    <Card>
      <Card.Header>
        <h2>{name}</h2>
      </Card.Header>
      <Card.Content className="flex-col gap-2">
        <p>{description}</p>
        <p>Статус: {isArchived ? "В архиве" : "Активен"}</p>
      </Card.Content>
    </Card>
  );
};
