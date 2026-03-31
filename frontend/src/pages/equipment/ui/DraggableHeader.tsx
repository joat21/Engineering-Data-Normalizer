import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, ButtonGroup, cn, Toolbar } from "@heroui/react";
import { flexRender, type Column, type Header } from "@tanstack/react-table";
import { EyeOff, GripVertical, Pin, PinOff } from "lucide-react";
import type { EquipmentRow } from "@engineering-data-normalizer/shared";
import { getPinningStyles } from "../model/utils";

interface HeaderProps {
  header: Header<EquipmentRow, unknown>;
  onPin: (column: Column<EquipmentRow, unknown>) => void;
  onHide: (column: Column<EquipmentRow, unknown>) => void;
}

export const DraggableHeader = ({ header, onPin, onHide }: HeaderProps) => {
  const column = header.column;
  const isPinned = column.getIsPinned();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: !!isPinned,
  });

  const pinningStyles = getPinningStyles({ column, isHeader: true });

  const style: React.CSSProperties = {
    ...pinningStyles,
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : pinningStyles.zIndex,
    width: column.getSize(),
  };

  const headerTitle = header.isPlaceholder
    ? null
    : flexRender(column.columnDef.header, header.getContext());

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={cn("px-4 py-3 font-semibold bg-gray-100 border-b group")}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            title={String(headerTitle ?? "")}
            className="text-xs uppercase tracking-wider text-default-600 leading-tight line-clamp-2 min-w-0"
          >
            {headerTitle}
          </span>
          {!isPinned && (
            <div
              {...attributes}
              {...listeners}
              className="p-1 opacity-30 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={16} />
            </div>
          )}
        </div>

        <Toolbar className="opacity-30 group-hover:opacity-100 transition-opacity">
          <ButtonGroup variant="outline">
            <Button
              isIconOnly
              onPress={() => onPin(column)}
              className="h-7 w-7"
            >
              {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </Button>
            <Button
              isIconOnly
              onPress={() => onHide(column)}
              className="h-7 w-7"
            >
              <EyeOff size={14} />
            </Button>
          </ButtonGroup>
        </Toolbar>
      </div>
    </th>
  );
};
