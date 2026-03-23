import { useState } from "react";
import { Button, Input, Label, Tooltip } from "@heroui/react";
import { List, TextCursorInput } from "lucide-react";
import type { StringFieldProps } from "../model/types";
import { AppSelect } from "@/shared/ui";

export const StringAttributeField = ({
  attributeKey,
  label,
  options,
}: StringFieldProps) => {
  const hasOptions = options.length > 0;
  const [isManualInput, setIsManualInput] = useState(!hasOptions);

  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>

      <div className="flex gap-1">
        {isManualInput ? (
          <Input
            className="w-full"
            name={attributeKey}
            placeholder={label}
            aria-label={label}
          />
        ) : (
          <SelectField
            attributeKey={attributeKey}
            label={label}
            options={options}
          />
        )}

        {hasOptions && (
          <Tooltip delay={0} closeDelay={0}>
            <Button isIconOnly onPress={() => setIsManualInput(!isManualInput)}>
              {isManualInput ? <List /> : <TextCursorInput />}
            </Button>
            <Tooltip.Content>
              {isManualInput ? "Выбрать из списка" : "Ввести вручную"}
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const SelectField = ({ attributeKey, label, options }: StringFieldProps) => {
  return (
    <AppSelect
      name={attributeKey}
      items={options.map((o) => ({ id: o.id, label: o.label }))}
      getItemKey={(o) => o.id}
      getItemLabel={(o) => o.label}
      className="w-full"
      aria-label={label}
    />
  );
};
