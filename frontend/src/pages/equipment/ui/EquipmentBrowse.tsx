import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnOrderState,
  type ColumnPinningState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { EquipmentRow } from "@engineering-data-normalizer/shared";
import { ColumnVisibility } from "./ColumnVisibility";
import { EquipmentTable } from "./EquipmentTable";
import { Filters } from "./Filters";
import { useEquipmentTableQuery } from "../model/useEquipmentTableQuery";
import { buildColumns } from "../model/utils";
import { useCategoryFilters } from "@/entities/category-filters";
import { useEquipmentTable } from "@/entities/equipment";
import { Pagination } from "./Pagination";

interface EquipmentBrowseProps {
  categoryId: string;
}

export const EquipmentBrowse = ({ categoryId }: EquipmentBrowseProps) => {
  const { query } = useEquipmentTableQuery();

  const { data: equipmentData, isPending: isEquipmentPending } =
    useEquipmentTable(query);
  const { data: categoryFilters, isPending: isFiltersPending } =
    useCategoryFilters(categoryId);

  const columns = useMemo(() => {
    if (!equipmentData?.headers) return [];
    return buildColumns(equipmentData.headers);
  }, [equipmentData?.headers]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((c) => c.id!),
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });

  useEffect(() => {
    if (columns.length > 0 && columnOrder.length === 0) {
      setColumnOrder(columns.map((c) => c.id!));
    }
  }, [columns]);

  const table = useReactTable<EquipmentRow>({
    columns,
    data: equipmentData?.rows ?? [],
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

  if (isEquipmentPending || isFiltersPending) return <Spinner />;
  if (!equipmentData) return "Произошла ошибка";

  return (
    <div className="flex gap-4 h-full items-start">
      <Filters filters={categoryFilters} />
      <div className="flex flex-col flex-1 gap-4 min-w-0">
        <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-default-200">
          <div className="text-sm text-default-500">
            Найдено позиций: {equipmentData.pagination.total}
          </div>
          <ColumnVisibility table={table} />
        </div>
        <EquipmentTable table={table} />
        <Pagination pagination={equipmentData.pagination} />
      </div>
    </div>
  );
};
