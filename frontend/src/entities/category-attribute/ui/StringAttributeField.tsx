import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Button, Input, Label, Tooltip } from "@heroui/react";
import { List, Plus } from "lucide-react";
import type { StringFieldProps } from "../model/types";
import { AppSelect } from "@/shared/ui";

export const StringAttributeField = ({
  attributeKey,
  label,
  options,
  variant,
}: StringFieldProps) => {
  const { control, setValue, getValues } = useFormContext();
  const value = useWatch({ control, name: attributeKey });
  const hasOptions = options.length > 0;

  const isValueInOptions = (val: any) =>
    options.some((o) => o.id === String(val));

  const [isManualInput, setIsManualInput] = useState(() => {
    if (!value) return !hasOptions;
    return !isValueInOptions(value);
  });

  useEffect(() => {
    if (!value || !hasOptions) return;

    const inList = isValueInOptions(value);
    setIsManualInput(!inList);
  }, [value, hasOptions]);

  const toggleMode = () => {
    const currentValue = getValues(attributeKey);

    if (isManualInput) {
      // Переход Input -> Select
      const foundOption = options.find(
        (o) => o.label.toLowerCase() === String(currentValue).toLowerCase(),
      );
      if (foundOption) {
        setValue(attributeKey, foundOption.id);
      }
    } else {
      // Переход Select -> Input
      const selectedOption = options.find((o) => o.id === currentValue);
      if (selectedOption) {
        setValue(attributeKey, selectedOption.label);
      }
    }

    setIsManualInput(!isManualInput);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="px-1 text-base">{label}</Label>

      <Controller
        name={attributeKey}
        control={control}
        render={({ field }) => (
          <div className="flex gap-1.5">
            <div className="flex-1">
              {isManualInput ? (
                <Input
                  {...field}
                  className="w-full"
                  placeholder={label}
                  aria-label={label}
                  variant={variant}
                  value={field.value ?? ""}
                />
              ) : (
                <AppSelect
                  {...field}
                  items={options}
                  getItemKey={(o) => o.id}
                  getItemLabel={(o) => o.label}
                  className="w-full"
                  aria-label={label}
                  variant={variant}
                  value={field.value ?? ""}
                />
              )}
            </div>

            {hasOptions && (
              <Tooltip delay={0} closeDelay={0}>
                <Button isIconOnly onPress={toggleMode}>
                  {isManualInput ? <List /> : <Plus />}
                </Button>
                <Tooltip.Content>
                  {isManualInput ? "Выбрать из списка" : "Ввести вручную"}
                </Tooltip.Content>
              </Tooltip>
            )}
          </div>
        )}
      ></Controller>
    </div>
  );
};
