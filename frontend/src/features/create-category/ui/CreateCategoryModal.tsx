import { useState } from "react";
import { Button, Input, Label, Modal, toast } from "@heroui/react";
import { useCreateCategoryMutation } from "../api/create-category.api";
import { AppModal, type AppModalProps } from "@/shared/ui";

export const CreateCategoryModal = ({ state, ...props }: AppModalProps) => {
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategoryMutation();

  const handleCreateCategory = async () => {
    if (!categoryName) {
      return toast.danger("Введите название категории");
    }

    await createCategoryMutation.mutateAsync({ name: categoryName });
    state.close();
  };

  return (
    <AppModal state={state} {...props}>
      <Modal.Dialog>
        <Modal.CloseTrigger />
        <Modal.Header>
          <Modal.Heading className="text-xl">Создание категории</Modal.Heading>
        </Modal.Header>
        <Modal.Body>
          <Label className="flex flex-col gap-1 text-lg">
            Название категории
            <Input
              placeholder="Введите название..."
              onChange={(e) => setCategoryName(e.target.value)}
              variant="secondary"
              required
            />
          </Label>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={state.close} variant="secondary">
            Отмена
          </Button>
          <Button
            onPress={handleCreateCategory}
            isDisabled={createCategoryMutation.isPending}
          >
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </AppModal>
  );
};
