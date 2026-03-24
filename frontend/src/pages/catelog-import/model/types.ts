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
