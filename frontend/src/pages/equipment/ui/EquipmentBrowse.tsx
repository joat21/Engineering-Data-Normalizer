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
    <div className="flex gap-3">
      <div className="flex flex-col gap-2"></div>
      <EquipmentTable
        headers={equipmentTable.headers}
        rows={equipmentTable.rows}
      />
    </div>
  );
};
