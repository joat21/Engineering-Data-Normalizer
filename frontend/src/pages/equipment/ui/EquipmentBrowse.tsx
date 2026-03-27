import { Spinner } from "@heroui/react";
import { EquipmentTable } from "./EquipmentTable";
import { useEquipmentTable } from "@/entities/equipment";

interface EquipmentBrowseProps {
  categoryId: string;
}

export const EquipmentBrowse = ({ categoryId }: EquipmentBrowseProps) => {
  const { data: equipmentTable, isPending } = useEquipmentTable(categoryId);

  if (isPending) return <Spinner />;
  if (!equipmentTable) return "Произошла ошибка";

  return (
    <div className="flex gap-4 h-full items-start">
      <aside className="w-72 shrink-0 sticky top-0">
        <div className="p-4 bg-white rounded-2xl border border-default-200 shadow-sm">
          <h3 className="font-semibold mb-4 text-default-700">Фильтры</h3>
          <div className="flex flex-col gap-4">
            <span>фильтры</span>
          </div>
        </div>
      </aside>
      <EquipmentTable
        headers={equipmentTable.headers}
        rows={equipmentTable.rows}
      />
    </div>
  );
};
