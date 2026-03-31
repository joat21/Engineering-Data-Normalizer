import type { Column } from "@tanstack/react-table";

export const getPinningStyles = ({
  column,
  isHeader,
}: {
  column: Column<any>;
  isHeader: boolean;
}): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const size = column.getSize();

  let zIndex = 0;
  if (isPinned) {
    zIndex = isHeader ? 35 : 25; // Закрепленные выше всего
  } else if (isHeader) {
    zIndex = 10; // Обычная шапка выше обычных ячеек
  }

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: size,
    minWidth: size,
    maxWidth: size,
    zIndex: zIndex,
  };
};

export const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis-start");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);

  return pages;
};
