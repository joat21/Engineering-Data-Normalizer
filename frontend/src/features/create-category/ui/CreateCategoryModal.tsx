import { Button, Input, Label, Modal, toast } from "@heroui/react";
import { useCreateCategoryMutation } from "../api/create-category.api";
import { useState } from "react";

interface CreateCategoryModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CreateCategoryModal = ({
  onClose,
  isOpen,
}: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const createCategoryMutation = useCreateCategoryMutation();

  const handleCreateCategory = async () => {
    if (!categoryName) {
      return toast.danger("Введите название категории");
    }

    await createCategoryMutation.mutateAsync({ name: categoryName });
    onClose();
  };

  return (
    <Modal.Backdrop isOpen={isOpen}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger onPress={onClose} />
          <Modal.Header>
            <Modal.Heading className="text-xl">
              Создание категории
            </Modal.Heading>
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
            <Button onPress={onClose} variant="secondary">
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
      </Modal.Container>
    </Modal.Backdrop>
  );
};
