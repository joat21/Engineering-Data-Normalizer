import { Card } from "@heroui/react";
import { AppLink } from "@/shared/ui";

export const ImportPage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="text-5xl">Импорт</h1>
      <span>Выберите тип импортируемого документа</span>
      <ul className="flex gap-4">
        <li>
          <AppLink to="catalog">
            <Card>Каталог</Card>
          </AppLink>
        </li>
        <li>
          <AppLink to="single">
            <Card>Паспорт изделия</Card>
          </AppLink>
        </li>
      </ul>
    </div>
  );
};
