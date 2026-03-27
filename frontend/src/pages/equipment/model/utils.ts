import type {
  EquipmentHeader,
  EquipmentRow,
} from "@engineering-data-normalizer/shared";
import type { Column, ColumnDef } from "@tanstack/react-table";

export const getPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const size = column.getSize();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: size,
    minWidth: size,
    maxWidth: size,
    zIndex: isPinned ? 1 : 0,
  };
};

export const buildColumns = (
  headers: EquipmentHeader[],
): ColumnDef<EquipmentRow, any>[] =>
  headers.map((header) => ({
    id: header.key,
    accessorKey: header.key,
    header: header.label,
    cell: (info) => {
      const value = info.getValue();
      return value !== null && value !== undefined ? String(value) : "—";
    },
  }));
