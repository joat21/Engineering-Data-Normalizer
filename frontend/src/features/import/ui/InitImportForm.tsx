import { useState } from "react";
import { Button, Card, Form, toast } from "@heroui/react";
import type { SourceType } from "@engineering-data-normalizer/shared";
import { useCategories } from "@/entities/category";
import { useCurrencies } from "@/entities/currency";
import { AppSelect, FileDropzone, PageLoader } from "@/shared/ui";
import { ACCEPTED_FORMATS } from "../model/config";
import { useCreateSupplierMutation, useSuppliers } from "@/entities/supplier";
import {
  useCreateManufacturerMutation,
  useManufacturers,
} from "@/entities/manufacturer";
import { ReferenceField } from "./ReferenceField";
import { resolveEntityId } from "../model/utils";

interface InitImportFormProps {
  onSubmit: (data: {
    file: File;
    categoryId: string;
    categoryName?: string;
    manufacturerId: string;
    supplierId: string;
    currencyId: string;
  }) => void;
  isLoading?: boolean;
  sourceType: SourceType;
}

export const InitImportForm = ({
  onSubmit,
  isLoading,
  sourceType,
}: InitImportFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [currencyId, setCurrencyId] = useState<string | null>(null);

  const { data: categories, isPending } = useCategories();
  const { data: manufacturers, isPending: isManufacturersPending } =
    useManufacturers();
  const { data: suppliers, isPending: isSuppliersPending } = useSuppliers();
  const { data: currencies, isPending: isCurrenciesPending } = useCurrencies();

  const createManufacturerMutation = useCreateManufacturerMutation();
  const createSupplierMutation = useCreateSupplierMutation();

  if (isManufacturersPending || isSuppliersPending) return <PageLoader />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId || !currencyId) return;
    if (!file) return toast.danger("Выберите файл");

    // получение поставщика и производителя перенесены из другого компонента
    // TODO: в идеале все привести к одному виду: state или formData

    const formData = new FormData(e.currentTarget);

    const manufacturerId = String(formData.get("manufacturerId") ?? "");
    const manufacturerName = String(formData.get("manufacturerName") ?? "");

    const supplierId = String(formData.get("supplierId") ?? "");
    const supplierName = String(formData.get("supplierName") ?? "");

    const [finalManufacturerId, finalSupplierId] = await Promise.all([
      resolveEntityId(
        manufacturerId,
        manufacturerName,
        manufacturers ?? [],
        createManufacturerMutation.mutateAsync,
      ),
      resolveEntityId(
        supplierId,
        supplierName,
        suppliers ?? [],
        createSupplierMutation.mutateAsync,
      ),
    ]);

    onSubmit({
      file,
      categoryId,
      categoryName: categories?.find((c) => c.id === categoryId)?.name,
      manufacturerId: finalManufacturerId!,
      supplierId: finalSupplierId!,
      currencyId,
    });
  };

  return (
    <Card className="flex-col gap-5 p-6 self-center max-w-125 w-full">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Выбор файла и категории</h2>
        <p className="text-default-foreground/60">
          Загрузите файл и укажите категорию оборудования для дальнейшей
          обработки
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FileDropzone
          onFileSelect={setFile}
          accept={ACCEPTED_FORMATS[sourceType]}
        />
        {file && (
          <p className="text-sm text-default-foreground/60">
            Выбран файл: {file.name}
          </p>
        )}

        <AppSelect
          name="category"
          label="Категория оборудования"
          placeholder="Выберите категорию"
          items={categories ?? []}
          isPending={isPending}
          getItemKey={(item) => item.id}
          getItemLabel={(item) => item.name}
          value={categoryId}
          onChange={(value) => setCategoryId(String(value))}
          variant="secondary"
          isRequired
        />

        <ReferenceField
          label="Производитель"
          name="manufacturer"
          items={manufacturers ?? []}
        />
        <ReferenceField
          label="Поставщик"
          name="supplier"
          items={suppliers ?? []}
        />

        <AppSelect
          name="currency"
          label="Валюта"
          placeholder="Выберите валюту"
          items={currencies ?? []}
          isPending={isCurrenciesPending}
          getItemKey={(item) => item.id}
          getItemLabel={(item) => `${item.name} (${item.code})`}
          value={currencyId}
          onChange={(value) => setCurrencyId(String(value))}
          variant="secondary"
          isRequired
        />

        <Button
          className="self-end"
          type="submit"
          isDisabled={!file}
          isPending={isLoading}
        >
          Продолжить
        </Button>
      </Form>
    </Card>
  );
};
