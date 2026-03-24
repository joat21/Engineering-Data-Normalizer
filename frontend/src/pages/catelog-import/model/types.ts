import {
  TransformType,
  type CategoryAttribute,
  type StagingColumn,
  type StagingRow,
} from "@engineering-data-normalizer/shared";

export const SelectionMode = {
  HEADER: "header",
  BODY: "body",
};

export type SelectionMode = (typeof SelectionMode)[keyof typeof SelectionMode];

export interface SelectionRange {
  start: CellCoords;
  end: CellCoords;
}

interface CellCoords {
  r: number;
  c: number;
}

export type ActiveTransformContext = {
  type: TransformationType;
  column: StagingColumn;
};

export const TransformationType = {
  ...TransformType,
  AI_PARSE: "AI_PARSE",
} as const;

export type TransformationType =
  (typeof TransformationType)[keyof typeof TransformationType];

export interface TransformationDialogProps {
  attributes: CategoryAttribute[];
  column: StagingColumn;
  rows: StagingRow[];
  sessionId: string;
  onClose: () => void;
}
