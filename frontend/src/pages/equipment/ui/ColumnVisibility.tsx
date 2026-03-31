import { useMemo } from "react";
import type { Table, VisibilityState } from "@tanstack/react-table";
import { Dropdown, Button, type Selection } from "@heroui/react";
import { Eye } from "lucide-react";

interface ColumnVisibilityProps<TData> {
  table: Table<TData>;
}

export const ColumnVisibility = <TData,>({
  table,
}: ColumnVisibilityProps<TData>) => {
  const selectedKeys = useMemo(() => {
    return new Set(
      table
        .getAllLeafColumns()
        .filter((col) => col.getIsVisible())
        .map((col) => col.id),
    );
  }, [table.getState().columnVisibility]);

  const handleSelectionChange = (keys: Selection) => {
    if (keys === "all") {
      table.toggleAllColumnsVisible(true);
      return;
    }

    const selectedIds = Array.from(keys);
    const newVisibility: VisibilityState = {};
    table.getAllLeafColumns().forEach((col) => {
      newVisibility[col.id] = selectedIds.includes(col.id);
    });

    table.setColumnVisibility(newVisibility);
  };

  return (
    <Dropdown>
      <Button aria-label="Видимость колонок">
        <Eye />
        Колонки ({selectedKeys.size})
      </Button>
      <Dropdown.Popover placement="bottom right">
        <Dropdown.Menu
          aria-label="Настройка видимости"
          shouldCloseOnSelect={false}
          disallowEmptySelection
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {table.getAllLeafColumns().map((column) => (
            <Dropdown.Item
              id={column.id}
              key={column.id}
              textValue={column.columnDef.header?.toString()}
            >
              {column.columnDef.header?.toString()}
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
