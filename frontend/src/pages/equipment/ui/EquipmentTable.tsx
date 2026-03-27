import type {
  EquipmentHeader,
  EquipmentRow,
} from "@engineering-data-normalizer/shared";

interface EquipmentTableProps {
  headers: EquipmentHeader[];
  rows: EquipmentRow[];
}

export const EquipmentTable = ({ headers, rows }: EquipmentTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-default-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-default-100 text-default-700 uppercase text-xs">
          <tr>
            {headers.map((header) => (
              <th key={header.key} className="px-4 py-3 font-semibold">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-default-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-default-50 transition-colors">
              {headers.map((header) => (
                <td key={header.key} className="px-4 py-3">
                  {row[header.key] ?? (
                    <span className="text-default-400">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
