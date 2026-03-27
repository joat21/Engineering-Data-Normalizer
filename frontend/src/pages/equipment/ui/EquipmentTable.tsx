import { flexRender, type Column, type Table } from "@tanstack/react-table";
import { Button } from "@heroui/react";
import { cn } from "@heroui/styles";
import { EyeOff, Pin, PinOff } from "lucide-react";
import type { EquipmentRow } from "@engineering-data-normalizer/shared";
import { getPinningStyles } from "../model/utils";

interface EquipmentTableProps {
  table: Table<EquipmentRow>;
}

export const EquipmentTable = ({ table }: EquipmentTableProps) => {
  const handleChangeColumnPin = (column: Column<EquipmentRow, unknown>) => {
    const pinningPost = column.getIsPinned();
    column.pin(pinningPost === "left" ? false : "left");
  };

  const handleChangeColumnVisibility = (
    column: Column<EquipmentRow, unknown>,
  ) => {
    if (table.getVisibleLeafColumns().length === 1) return;
    column.toggleVisibility();
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-default-200">
      <table className="w-full text-sm text-left table-fixed border-separate border-spacing-0">
        <thead className="bg-default-100 text-default-700 uppercase text-xs">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const col = header.column;

                return (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 font-semibold bg-gray-400",
                      col.getIsPinned() &&
                        "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                    )}
                    style={getPinningStyles(col)}
                  >
                    <div className="flex flex-col gap-2">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              col.columnDef.header,
                              header.getContext(),
                            )}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          onPress={() => handleChangeColumnPin(col)}
                          isIconOnly
                        >
                          {col.getIsPinned() ? <PinOff /> : <Pin />}
                        </Button>
                        <Button
                          onPress={() =>
                            handleChangeColumnVisibility(header.column)
                          }
                          isIconOnly
                        >
                          {col.getIsVisible() && <EyeOff />}
                        </Button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-default-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-default-50">
              {row.getVisibleCells().map((cell) => {
                const isPinned = cell.column.getIsPinned();

                return (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-3 bg-white group-hover:bg-default-50",
                      isPinned && "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                    )}
                    style={getPinningStyles(cell.column)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
