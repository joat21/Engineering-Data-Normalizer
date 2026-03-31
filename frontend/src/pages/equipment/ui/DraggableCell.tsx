import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Cell } from "@tanstack/react-table";
import type { EquipmentRow } from "@engineering-data-normalizer/shared";
import { getPinningStyles } from "../model/utils";
import { cn } from "@heroui/styles";

interface DraggableCellProps {
  cell: Cell<EquipmentRow, unknown>;
}

export const DraggableCell = ({ cell }: DraggableCellProps) => {
  const column = cell.column;
  const isPinned = column.getIsPinned();

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    disabled: !!isPinned,
  });

  const style: React.CSSProperties = {
    ...getPinningStyles({ column, isHeader: false }),
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <td
      ref={setNodeRef}
      style={style}
      className={cn(
        "px-4 py-3 border-b text-center bg-white",
        isPinned && "shadow-2xl",
      )}
    >
      <CellContent cell={cell} />
    </td>
  );
};

const CellContent = memo(({ cell }: { cell: any }) => (
  <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
));
