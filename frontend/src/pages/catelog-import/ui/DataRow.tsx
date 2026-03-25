import { memo } from "react";
import { Checkbox } from "@heroui/react";
import type { StagingRow } from "@engineering-data-normalizer/shared";
import { useSelectionStore } from "../model/store";

interface DataRowProps {
  row: StagingRow;
  isSelecting: boolean;
  columnKeys: string[];
}

export const DataRow = memo(
  ({ row, isSelecting, columnKeys }: DataRowProps) => {
    const isSelected = useSelectionStore((s) => !!s.selectedRowIds[row.id]);
    const toggleRow = useSelectionStore((s) => s.toggleRow);

    return (
      <tr key={row.id} id={row.id}>
        {isSelecting && (
          <td className="pr-0">
            <Checkbox
              aria-label={`Select`}
              slot="selection"
              variant="secondary"
              isSelected={isSelected}
              onChange={() => toggleRow(row.id)}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox>
          </td>
        )}
        {columnKeys.map((key) => (
          <td key={key}>{row.values[key]}</td>
        ))}
      </tr>
    );
  },
);
