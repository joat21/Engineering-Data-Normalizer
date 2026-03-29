import { useNavigate } from "react-router";
import { Button, Spinner, useOverlayState } from "@heroui/react";
import { ImportSuccessModal } from "./ImportSuccessModal";
import { ResolveNormalizationIssuesModal } from "./ResolveNormalizationIssuesModal";
import { RowsSelectionPanel } from "./RowsSelectionPanel";
import { TableBody } from "./TableBody";
import { TableHeader } from "./TableHeader";
import { TransformModalManager } from "./TransformModalManager";
import {
  CatalogImportStep,
  useCreateEquipmentFromStagingMutation,
  useImportStore,
  useStagingTable,
} from "@/features/import";
import { useCategoryAttributes } from "@/entities/category-attribute";

interface MapColumnsProps {
  sessionId: string;
  categoryId: string;
}

export const MapColumns = ({ sessionId, categoryId }: MapColumnsProps) => {
  const navigate = useNavigate();
  const successModal = useOverlayState();

  const resetImport = useImportStore((s) => s.reset);
  const setStep = useImportStore((s) => s.setStep);

  const createEquipmentFromStagingMutation =
    useCreateEquipmentFromStagingMutation();

  const { data: table, isPending: isTablePending } = useStagingTable({
    sessionId,
  });

  const { data: attributes, isPending: isAttributesPending } =
    useCategoryAttributes(categoryId);

  if (isTablePending || isAttributesPending) return <Spinner />;
  if (!table || !attributes) return "Произошла ошибка";

  const handleSave = () => {
    createEquipmentFromStagingMutation.mutate(
      { sessionId },
      { onSuccess: () => successModal.open() },
    );
  };

  const handleFinish = () => {
    resetImport();
    successModal.close();
    navigate("/");
  };

  const handleAddMore = () => {
    successModal.close();
    setStep(CatalogImportStep.INIT_TABLE);
  };

  return (
    <>
      <div className="flex flex-col gap-2 pt-4">
        <Button onPress={handleSave}>Сохранить оборудование</Button>
        <table>
          <TableHeader
            columns={table.columns}
            attributes={attributes}
            isAttributesPending={isAttributesPending}
            sessionId={sessionId}
          />
          <TableBody table={table} />
        </table>
      </div>

      <RowsSelectionPanel />

      <ResolveNormalizationIssuesModal />

      <ImportSuccessModal
        isOpen={successModal.isOpen}
        onFinish={handleFinish}
        onAddMore={handleAddMore}
      />

      <TransformModalManager
        attributes={attributes}
        rows={table.rows}
        sessionId={sessionId}
      />
    </>
  );
};
