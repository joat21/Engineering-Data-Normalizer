import { useParams } from "react-router";
import { Button, Spinner, useOverlayState } from "@heroui/react";
import { useCategory } from "@/entities/category";
import { CreateCategoryAttributeModal } from "@/features/create-category-attibute";

export const CategoryPage = () => {
  const { id = "" } = useParams();
  const createCategoryAttributeModal = useOverlayState();

  const { data: category, isPending } = useCategory({ id });

  if (isPending) return <Spinner />;

  return (
    <>
      <div className="flex flex-col gap-8 mx-auto px-4 w-full max-w-350">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">
              Категория {category?.name}
            </h1>
            <p>
              Выберите категорию, чтобы перейти к созданию и редактированию
              атрибутов
            </p>
          </div>
          <Button onPress={createCategoryAttributeModal.open}>
            + Создать атрибут
          </Button>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {category?.attributes.map((attr) => (
            <li key={attr.id} className="w-full list-none">
              {attr.label}
            </li>
          ))}
        </ul>
      </div>

      <CreateCategoryAttributeModal
        categoryId={id}
        isOpen={createCategoryAttributeModal.isOpen}
        onClose={createCategoryAttributeModal.close}
      />
    </>
  );
};
