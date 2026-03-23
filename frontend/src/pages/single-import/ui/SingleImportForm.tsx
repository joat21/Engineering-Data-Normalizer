import { Button, Form } from "@heroui/react";
import {
  MappingTargetType,
  type CategoryAttribute,
  type CreateEquipmentBody,
  type MappingTarget,
  type NormalizedValue,
} from "@engineering-data-normalizer/shared";
import { useCreateEquipmentMutation } from "../api/single-import.api";
import { useImportStore } from "@/features/import";
import { AttributeField } from "@/entities/category-attribute";

interface SingleImportFormProps {
  attributes?: CategoryAttribute[];
}

export const SingleImportForm = ({ attributes }: SingleImportFormProps) => {
  const createEquipmentMutation = useCreateEquipmentMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { sessionId } = useImportStore.getState();

    const normalizedData = attributes?.map((attr) => {
      const target: MappingTarget =
        attr.type === MappingTargetType.ATTRIBUTE
          ? {
              type: attr.type,
              id: attr.id,
            }
          : { type: attr.type, field: attr.key as any }; // TODO: в идеале типизировать как системное поле

      let normalized: NormalizedValue = { valueString: "" };
      let rawValue = "";

      switch (attr.dataType) {
        case "STRING":
          const strVal = String(formData.get(attr.key) ?? "");
          rawValue = strVal;
          normalized = { valueString: strVal };
          break;
        case "NUMBER":
          const min = formData.get(`${attr.key}_valueMin`);
          const max = formData.get(`${attr.key}_valueMax`);
          rawValue = min === max ? String(min ?? "") : `${min} — ${max}`;
          normalized = {
            valueString: rawValue,
            valueMin: min ? Number(min) : undefined,
            valueMax: max ? Number(max) : undefined,
          };
          break;
        case "BOOLEAN":
          const boolVal = formData.get(attr.key) === "on";
          rawValue = String(boolVal);
          normalized = {
            valueString: rawValue,
            valueBoolean: boolVal,
          };
          break;
      }

      return {
        target,
        rawValue,
        normalized,
      };
    });

    const payload: CreateEquipmentBody = {
      sessionId: sessionId ?? "",
      normalizedData:
        normalizedData?.filter((item) => {
          const val = item.normalized;

          if (
            val.valueString === "" &&
            val.valueMin === undefined &&
            val.valueMax === undefined &&
            val.valueBoolean === undefined
          ) {
            return false;
          }

          return true;
        }) ?? [],
    };

    createEquipmentMutation.mutate(payload, {
      onSuccess: () => alert("Оборудование сохранено"),
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 w-full">
      {attributes?.map((attr) => (
        <AttributeField
          key={attr.key}
          attributeKey={attr.key}
          label={attr.label}
          unit={attr.unit}
          dataType={attr.dataType}
        />
      ))}
      <Button type="submit" isPending={createEquipmentMutation.isPending}>
        Сохранить
      </Button>
    </Form>
  );
};
