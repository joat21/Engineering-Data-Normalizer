import {
  Button,
  Card,
  Collection,
  Form,
  Input,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import type { SourceType } from "@engineering-data-normalizer/shared";
import { useCategories, useInitImportMutation } from "../api/init-import.api";
import { useImportStore } from "../../../features/import";

interface InitImportProps {
  sourceType: SourceType;
}

export const InitImport = ({ sourceType }: InitImportProps) => {
  const { setInitialData, setCategoryId, setSessionId } = useImportStore();
  const { data: categories, isPending } = useCategories();
  const initImportMutation = useInitImportMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fileInput = e.currentTarget.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = fileInput?.files?.[0];
    const categoryId = String(formData.get("category"));

    if (!file) return alert("Выберите файл");

    initImportMutation.mutate(
      { sourceType, categoryId, file },
      {
        onSuccess: (data) => {
          setInitialData({ categoryId, file, sourceType });
          setCategoryId(categoryId);
          setSessionId(data.sessionId);
        },
      },
    );
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Card>
        <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input type="file" />
          <Select name="category" placeholder="Выберите категорию">
            <Label>Категория оборудования</Label>
            <Select.Trigger isPending={isPending}>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <Collection items={categories}>
                  {(item) => (
                    <ListBox.Item id={item.id} textValue={item.name}>
                      {item.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </Collection>
              </ListBox>
            </Select.Popover>
          </Select>
          <Button type="submit">Продолжить</Button>
        </Form>
      </Card>
    </div>
  );
};
