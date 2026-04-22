import { SourceType } from "@engineering-data-normalizer/shared";
import {
  CatalogImportStep,
  InitImportForm,
  useImportStore,
} from "@/features/import";

export const InitCatalogImport = () => {
  const { setInitialData, setStep } = useImportStore();

  const handleNext = (data: {
    file: File;
    categoryId: string;
    categoryName?: string;
    manufacturerId: string;
    supplierId: string;
    currencyId: string;
  }) => {
    setInitialData({ ...data, sourceType: SourceType.CATALOG });
    setStep(CatalogImportStep.INIT_TABLE);
  };

  return (
    <InitImportForm onSubmit={handleNext} sourceType={SourceType.CATALOG} />
  );
};
