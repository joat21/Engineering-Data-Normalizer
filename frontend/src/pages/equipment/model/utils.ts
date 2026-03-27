import type { Column } from "@tanstack/react-table";

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
