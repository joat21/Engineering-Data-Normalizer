import { useMemo, useState } from "react";
import { Button, Checkbox, cn, Input, Label, Modal } from "@heroui/react";
import { useTransformationContextStore } from "../model/store";
import type { TransformationDialogProps } from "../model/types";
import {
  MappingTargetType,
  PrevActionType,
  type AiParseColumnResult,
  type CategoryAttribute,
} from "@engineering-data-normalizer/shared";
import {
  useApplyAiParseMutation,
  useEditAiParseResultsMutation,
  useSaveAiParseResultsMutation,
} from "@/features/import";

type Status = "PENDING" | "TESTED" | "PARSED_ALL";

interface AIParseDialogProps extends TransformationDialogProps {
  selectedRowIds: Record<string, boolean>;
}

export const AIParseDialog = ({
  column,
  rows,
  attributes,
  sessionId,
  onClose,
  selectedRowIds,
}: AIParseDialogProps) => {
  const setNormalizationContext = useTransformationContextStore(
    (s) => s.setNormalizationContext,
  );
  const [status, setStatus] = useState<Status>("PENDING");
  const [selectedAttrIds, setSelectedAttrIds] = useState<string[]>([]);
  const [parsingSessionId, setParsingSessionId] = useState<string | null>(null);
  const [parsingResult, setParsingResult] =
    useState<AiParseColumnResult | null>(null);

  const [edits, setEdits] = useState<Record<string, string>>({});

  const applyAiParseMutation = useApplyAiParseMutation();
  const saveAiParseResultsMutation = useSaveAiParseResultsMutation();
  const editAiParseResultsMutation = useEditAiParseResultsMutation();

  const selectedValues = useMemo(
    () =>
      rows
        .filter((row) => !!selectedRowIds[row.id])
        .map((row) => row.values[column.id]),
    [rows, selectedRowIds],
  );

  const handleSelectAttribute = (
    isSelected: boolean,
    attr: CategoryAttribute,
  ) => {
    setSelectedAttrIds((prevIds) => {
      let newIds = prevIds;

      if (!isSelected) {
        newIds = prevIds.filter((id) => id !== attr.id);
      } else {
        newIds.push(attr.id);
      }

      return newIds;
    });
  };

  const handleTestParse = () => {
    const targets = attributes
      .filter((attr) => selectedAttrIds.includes(attr.id))
      .map((attr) => ({ type: attr.type, key: attr.key, label: attr.label }));

    const payload = {
      importSessionId: sessionId,
      colIndex: column.originIndex,
      testRowIds: Object.keys(selectedRowIds),
      targets,
    };

    console.log(payload);

    applyAiParseMutation.mutate(payload, {
      onSuccess: (data) => {
        setStatus("TESTED");
        setParsingSessionId(data.parsingSessionId);
        setParsingResult(data);
      },
    });
  };

  const handleParseAll = () => {
    if (!parsingSessionId) return;

    const targets = attributes
      .filter((attr) => selectedAttrIds.includes(attr.id))
      .map((attr) => ({ type: attr.type, key: attr.key, label: attr.label }));

    const payload = {
      importSessionId: sessionId,
      parsingSessionId,
      colIndex: column.originIndex,
      testRowIds: Object.keys(selectedRowIds),
      targets,
    };

    applyAiParseMutation.mutate(payload, {
      onSuccess: (data) => {
        setStatus("PARSED_ALL");
        setParsingResult(data);
      },
    });
  };

  const handleApply = () => {
    if (!parsingSessionId) return;

    console.log(parsingSessionId);

    const targets = attributes
      .filter((attr) => selectedAttrIds.includes(attr.id))
      .map((attr) => {
        if (attr.type === MappingTargetType.ATTRIBUTE) {
          return { type: attr.type, id: attr.id };
        } else {
          return { type: attr.type, field: attr.key as any };
        }
      });

    const payload = {
      importSessionId: sessionId,
      sessionId: parsingSessionId,
      sourceColIndex: column.originIndex,
      targets,
    };

    saveAiParseResultsMutation.mutate(payload, {
      onSuccess: (data, variables) => {
        if (data.issues.length > 0) {
          setNormalizationContext({
            issues: data.issues,
            metadata: {
              sessionId: variables.importSessionId,
              colIndex: variables.sourceColIndex,
              targets: variables.targets,
              prevActionType: PrevActionType.DIRECT,
            },
          });
        }
        alert("Данные сохранены");
        onClose();
      },
    });
  };

  const handleCellEdit = (rowId: string, targetKey: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [`${rowId}:${targetKey}`]: value,
    }));
  };

  const handleSaveEdits = () => {
    if (!parsingSessionId) return;

    const editedValues = Object.entries(edits).map(([key, value]) => {
      const [sourceItemId, targetKey] = key.split(":");
      return {
        sourceItemId,
        targetKey: targetKey as any,
        newRawValue: value,
      };
    });

    console.log(editedValues);

    editAiParseResultsMutation.mutate(
      {
        sessionId: parsingSessionId,
        editedValues,
      },
      {
        onSuccess: () => {
          setParsingResult((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              rows: prev.rows.map((row) => {
                const currentEntries = editedValues.filter(
                  (e) => e.sourceItemId === row.id,
                );
                if (currentEntries.length === 0) return row;

                const newValues = [...row.values];

                currentEntries.forEach((entry) => {
                  const colIndex = prev.headers.findIndex(
                    (h) => h.key === entry.targetKey,
                  );

                  // в headers есть еще колонка sourceString, поэтому делаем -1
                  // (при рендере строк делали +1)
                  // (костыль)
                  const valuesIndex = colIndex - 1;

                  if (valuesIndex >= 0) {
                    newValues[valuesIndex] = entry.newRawValue;
                  }
                });

                return { ...row, values: newValues };
              }),
            };
          });

          setEdits({});
        },
      },
    );
  };

  return (
    <Modal.Dialog aria-label="ИИ-парсинг">
      <Modal.CloseTrigger />
      <Modal.Header>
        <div>
          <h2 className="text-xl font-semibold">ИИ-парсинг</h2>
          <p className="text-sm text-gray-600 mt-1">Колонка: {column.label}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-1">
          <span>Выбранные значения:</span>
          {selectedValues.map((val, i) => (
            <Input
              key={i}
              value={val}
              variant="secondary"
              aria-label={val}
              disabled
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <span>Выберите атрибуты для извлечения:</span>
          <div className="grid grid-cols-2">
            {attributes.map((attr) => (
              <Checkbox
                key={attr.id}
                name={attr.key}
                onChange={(isSelected) =>
                  handleSelectAttribute(isSelected, attr)
                }
                variant="secondary"
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>{attr.label}</Label>
                </Checkbox.Content>
              </Checkbox>
            ))}
          </div>
        </div>
        {parsingResult && (
          <div className="flex flex-col gap-1">
            <span>Результаты анализа:</span>
            <table>
              <thead>
                <tr>
                  {parsingResult.headers.map((h) => (
                    <th key={h.key}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsingResult.rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.sourceString}</td>
                    {row.values.map((v, i) => {
                      // i + 1 потому что в headers лежит еще и sourceString
                      const header = parsingResult.headers[i + 1];
                      const targetKey = header.key;
                      const cellKey = `${row.id}:${targetKey}`;
                      const displayValue = edits[cellKey] ?? v;

                      const isEdited = !!edits[`${row.id}:${targetKey}`];

                      return (
                        <td key={i}>
                          <Input
                            value={displayValue}
                            onChange={(e) =>
                              handleCellEdit(row.id, targetKey, e.target.value)
                            }
                            className={cn(
                              isEdited && "bg-blue-50 border-blue-200",
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={onClose} variant="secondary">
          Отмена
        </Button>
        {status === "PENDING" && (
          <Button onPress={handleTestParse}>Тест</Button>
        )}
        {status === "TESTED" && (
          <Button onPress={handleParseAll}>Применить ко всей колонке</Button>
        )}
        {status === "PARSED_ALL" && (
          <Button onPress={handleApply}>Сохранить</Button>
        )}
        {Object.keys(edits).length > 0 && (
          <Button onPress={handleSaveEdits}>Сохранить правки</Button>
        )}
      </Modal.Footer>
    </Modal.Dialog>
  );
};
