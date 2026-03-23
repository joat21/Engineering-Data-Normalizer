import { SourceType } from "@engineering-data-normalizer/shared";
import { SingleImportForm } from "./SingleImportForm";
import { InitImport } from "@/widgets/init-import/ui/InitImport";
import { SingleImportStep, useImportStore } from "@/features/import";
import { useCategoryAttributes } from "@/entities/category-attribute";

export const SingleImportPage = () => {
  const { step, categoryId } = useImportStore();
  const { data: categoryAttributes } = useCategoryAttributes(categoryId ?? "");

  return (
    <div className="flex justify-center items-center w-full">
      {step === SingleImportStep.TYPE_SELECTION && (
        <InitImport sourceType={SourceType.SINGLE_ITEM} />
      )}

      {step === SingleImportStep.FILL_ATTRIBUTES && (
        <SingleImportForm attributes={categoryAttributes} />
      )}
    </div>
  );
};
