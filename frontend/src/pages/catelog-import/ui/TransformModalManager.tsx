import type {
  CategoryAttribute,
  StagingRow,
} from "@engineering-data-normalizer/shared";
import {
  TransformationType,
  type ActiveTransformContext,
} from "../model/types";
import { Modal } from "@heroui/react";
import { ExtractNumbersDialog } from "./ExtractNumbersDialog";

interface TransformModalManagerProps {
  transformContext: ActiveTransformContext | null;
  onClose: () => void;
  rows: StagingRow[];
  attributes: CategoryAttribute[];
  sessionId: string;
}

export const TransformModalManager = ({
  transformContext,
  onClose,
  rows,
  attributes,
  sessionId,
}: TransformModalManagerProps) => {
  const isOpen = transformContext !== null;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Container>
        {isOpen && (
          <ModalContentRouter
            transformContext={transformContext}
            rows={rows}
            attributes={attributes}
            sessionId={sessionId}
            onClose={onClose}
          />
        )}
      </Modal.Container>
    </Modal.Backdrop>
  );
};

const ModalContentRouter = ({
  transformContext,
  ...props
}: TransformModalManagerProps) => {
  if (!transformContext) return;

  switch (transformContext.type) {
    case TransformationType.EXTRACT_NUMBERS:
      return (
        <ExtractNumbersDialog column={transformContext.column} {...props} />
      );

    // case TransformationType.SPLIT_BY:
    //   return <SplitByDialog column={transformContext.column} {...props} />;

    // case TransformationType.AI_PARSE:
    //   return <AIParseDialog column={transformContext.column} {...props} />;

    default:
      return null;
  }
};
