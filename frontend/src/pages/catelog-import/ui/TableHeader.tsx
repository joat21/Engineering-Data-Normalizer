import { Checkbox, type Key } from "@heroui/react";
import {
  MappingTargetType,
  type CategoryAttribute,
  type MappingTarget,
  type StagingColumn,
} from "@engineering-data-normalizer/shared";
import { HeaderColumn } from "./HeaderColumn";
import {
  useSelectionStore,
  useTransformationContextStore,
} from "../model/store";
import { useMappingMutation } from "@/features/import";
import { TransformationType } from "../model/types";
import { useCallback } from "react";

interface TableHeaderProps {
  columns: StagingColumn[];
  attributes: CategoryAttribute[];
  isAttributesPending: boolean;
  sessionId: string;
}

export const TableHeader = ({
  columns,
  attributes,
  isAttributesPending,
  sessionId,
}: TableHeaderProps) => {
  const mappingMutation = useMappingMutation();

  const setContext = useTransformationContextStore((s) => s.setContext);
  const isSelecting = useTransformationContextStore((s) => s.isSelecting);

  const handleSelectAttribute = useCallback(
    (col: StagingColumn, value: Key | null) => {
      const attr = attributes?.find((a) => a.id === value);
      if (!attr) return;

      const target: MappingTarget =
        attr.type === MappingTargetType.ATTRIBUTE
          ? { type: MappingTargetType.ATTRIBUTE, id: attr.id }
          : { type: MappingTargetType.SYSTEM, field: attr.id as any };

      mappingMutation.mutate({ sessionId, colIndex: col.originIndex, target });
    },
    [attributes, mappingMutation, sessionId],
  );

  const handleSelectTransformation = useCallback(
    (col: StagingColumn, type: TransformationType) => {
      if (type === TransformationType.AI_PARSE) {
        useSelectionStore.getState().clear();
        setContext({
          type,
          column: col,
          step: "SELECTING_ROWS",
        });
      } else {
        setContext({ type, column: col });
      }
    },
    [setContext],
  );

  return (
    <thead>
      <tr>
        {isSelecting && (
          <th className="pr-0">
            <Checkbox aria-label="Выбрать все" slot="selection">
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox>
          </th>
        )}
        {columns.map((col) => (
          <th key={col.id}>
            <HeaderColumn
              col={col}
              attributes={attributes}
              onSelectAttribute={handleSelectAttribute}
              onSelectTransformation={handleSelectTransformation}
              isAttributesPending={isAttributesPending}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};
