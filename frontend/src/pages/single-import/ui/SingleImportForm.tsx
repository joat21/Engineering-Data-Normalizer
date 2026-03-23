import {
  MappingTargetType,
  type CategoryAttribute,
  type CreateEquipmentBody,
  type MappingTarget,
  type NormalizedValue,
} from "@engineering-data-normalizer/shared";
import {
  Button,
  Checkbox,
  Description,
  Form,
  Input,
  Label,
  NumberField,
  TextField,
} from "@heroui/react";
import { useImportStore } from "@/features/import";
import { useCreateEquipmentMutation } from "../api/single-import.api";

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
      {attributes?.map((attr) => {
        switch (attr.dataType) {
          case "STRING":
            return (
              <TextField key={attr.key} name={attr.key}>
                <Label>{attr.label}</Label>
                <Input placeholder={attr.label} />
              </TextField>
            );
          case "NUMBER":
            return (
              <div key={attr.key} className="flex flex-col gap-1">
                <Label>
                  {attr.label} {attr.unit}
                </Label>
                <div className="flex gap-1">
                  <NumberField
                    aria-label={attr.label}
                    name={`${attr.key}_valueMin`}
                    className="max-w-44"
                  >
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input placeholder="Минимум" />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                  <NumberField
                    aria-label={attr.label}
                    name={`${attr.key}_valueMax`}
                    className="max-w-44"
                  >
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input placeholder="Максимум" />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </div>
                <Description>
                  Если значение одно - заполняйте им минимум и максимум
                </Description>
              </div>
            );
          case "BOOLEAN":
            return (
              <Checkbox key={attr.key} name={attr.key}>
                <Label>{attr.label}</Label>
              </Checkbox>
            );
        }
      })}
      <Button type="submit" isPending={createEquipmentMutation.isPending}>
        Сохранить
      </Button>
    </Form>
  );
};
