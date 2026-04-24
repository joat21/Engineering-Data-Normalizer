import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  Radio,
  RadioGroup,
  TextArea,
} from "@heroui/react";
import type { Project } from "@engineering-data-normalizer/shared";
import { useEditProjectMutation } from "../api/edit-project.api";
import { AppModal, type AppModalProps } from "@/shared/ui";

interface EditProjectModalProps extends AppModalProps {
  project: Project;
}

export const EditProjectModal = ({
  project,
  state,
  ...props
}: EditProjectModalProps) => {
  const editProjectMutation = useEditProjectMutation();

  const handleEditProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      id: project.id,
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      isArchived: formData.get("status") !== "active",
    };

    await editProjectMutation.mutateAsync(payload);
    state.close();
  };

  return (
    <AppModal state={state} {...props}>
      <Modal.Dialog>
        <Modal.CloseTrigger />
        <Modal.Header>
          <Modal.Heading className="text-2xl">
            Редактирование проекта
          </Modal.Heading>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="edit-category-attribute"
            onSubmit={handleEditProject}
            className="flex flex-col gap-4"
          >
            <Label htmlFor="name" className="flex flex-col gap-1 text-lg">
              Название
              <Input
                id="name"
                name="name"
                placeholder="Введите название..."
                defaultValue={project.name}
                variant="secondary"
                required
              />
            </Label>
            <Label
              htmlFor="description"
              className="flex flex-col gap-1 text-lg"
            >
              Описание
              <TextArea
                id="description"
                name="description"
                placeholder="Введите описание..."
                defaultValue={project.description}
                variant="secondary"
                required
              />
            </Label>
            <Label htmlFor="status" className="flex flex-col gap-1 text-lg">
              Статус
              <RadioGroup
                defaultValue={project.isArchived ? "archived" : "active"}
                name="status"
                orientation="horizontal"
                variant="secondary"
              >
                <Radio value="active">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>Активен</Label>
                  </Radio.Content>
                </Radio>
                <Radio value="archived">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>В архиве</Label>
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </Label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={state.close} variant="secondary">
            Отмена
          </Button>
          <Button
            form="edit-category-attribute"
            type="submit"
            isDisabled={editProjectMutation.isPending}
          >
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </AppModal>
  );
};
