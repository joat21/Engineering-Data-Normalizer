export type ColumnMetadata = {
  id: string;
  label: string;
  originIndex: number;
  subIndex?: number;
};

export const isSubColumn = (
  col: ColumnMetadata,
): col is ColumnMetadata & { subIndex: number } => {
  return "subIndex" in col && col.subIndex !== undefined;
};
