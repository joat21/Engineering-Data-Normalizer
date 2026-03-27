import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type VisibilityState,
} from "@tanstack/react-table";
import type {
  EquipmentHeader,
  EquipmentRow,
} from "@engineering-data-normalizer/shared";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@heroui/styles";
import { getPinningStyles } from "../model/utils";
import { Button } from "@heroui/react";

interface EquipmentTableProps {
  headers: EquipmentHeader[];
  rows: EquipmentRow[];
}

export const EquipmentTable = ({ headers, rows }: EquipmentTableProps) => {
  const columns = useMemo<ColumnDef<EquipmentRow, any>[]>(() => {
    return headers.map((header) => ({
      accessorKey: header.key,
      id: header.key,
      header: header.label,
      cell: (info) => {
        const value = info.getValue();
        return value !== null && value !== undefined ? String(value) : "—";
      },
    }));
  }, [headers]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    headers.map((h) => h.key),
  );

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  const table = useReactTable({
    columns,
    data: rows,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
  });

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-default-200">
      <table className="w-full text-sm text-left table-fixed border-separate border-spacing-0">
        <thead className="bg-default-100 text-default-700 uppercase text-xs">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isPinned = header.column.getIsPinned();

                return (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 font-semibold bg-gray-400",
                      isPinned && "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                    )}
                    style={getPinningStyles(header.column)}
                  >
                    <div className="flex flex-col gap-2">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </span>
                      <Button
                        onPress={() =>
                          header.column.pin(
                            isPinned === "left" ? false : "left",
                          )
                        }
                        isIconOnly
                      >
                        {isPinned ? <PinOff /> : <Pin />}
                      </Button>
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
