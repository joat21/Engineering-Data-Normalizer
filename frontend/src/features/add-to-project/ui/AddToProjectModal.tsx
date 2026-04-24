import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { useAddToProjectMutation } from "../api/add-to-project.api";
import { useProjects } from "@/entities/project";
import { AppModal, AppSelect, type AppModalProps } from "@/shared/ui";

interface AddToProjectModalProps extends AppModalProps {
  selectedEquipmentId: string | null;
}

export const AddToProjectModal = ({
  selectedEquipmentId,
  state,
  ...props
}: AddToProjectModalProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const addToProjectMutation = useAddToProjectMutation();
  const { data: projects } = useProjects();

  const handleAddToProject = () => {
    if (!selectedEquipmentId || !selectedProjectId) return;

    addToProjectMutation.mutate({
      equipmentId: selectedEquipmentId,
      projectId: selectedProjectId,
      amount: 1,
    });
    state.close();
  };

  return (
    <AppModal state={state} {...props}>
      <Modal.Dialog>
        <Modal.CloseTrigger />
        <Modal.Header>
          <Modal.Heading>Выберите проект</Modal.Heading>
        </Modal.Header>
        <Modal.Body>
          <AppSelect
            items={projects ?? []}
            getItemKey={(p) => p.id}
            getItemLabel={(p) => p.name}
            aria-label="Проекты"
            variant="secondary"
            onChange={(value) => setSelectedProjectId(String(value ?? ""))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={state.close} variant="secondary">
            Отмена
          </Button>
          <Button onPress={handleAddToProject}>Подтвердить</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </AppModal>
  );
};
