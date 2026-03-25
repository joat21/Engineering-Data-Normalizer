import { Button, Card } from "@heroui/react";
import {
  useSelectionStore,
  useTransformationContextStore,
} from "../model/store";
import { TransformationType } from "../model/types";

export const RowsSelectionPanel = () => {
  const activeContext = useTransformationContextStore((s) => s.activeContext);
  const setContext = useTransformationContextStore((s) => s.setContext);
  const isSelecting = useTransformationContextStore((s) => s.isSelecting);
  const count = useSelectionStore((s) => s.count);

  if (!isSelecting) return null;

  const handleCancel = () => {
    setContext(null);
    useSelectionStore.getState().clear();
  };
  const handleContinue = () => {
    if (activeContext?.type !== TransformationType.AI_PARSE) return;
    setContext({ ...activeContext, step: "CONFIG_MODAL" });
  };

  return (
    <Card className="fixed flex-row bottom-10 left-1/2 -translate-x-1/2 shadow-xl p-4 gap-4 items-center border">
      <span>Выберите строки для ИИ: {count} / 5</span>
      <Button onPress={handleCancel}>Отмена</Button>
      <Button variant="primary" isDisabled={!count} onPress={handleContinue}>
        Продолжить
      </Button>
    </Card>
  );
};
