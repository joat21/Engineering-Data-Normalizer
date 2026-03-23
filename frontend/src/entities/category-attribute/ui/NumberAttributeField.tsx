import { useState } from "react";
import { Button, Label, Tooltip } from "@heroui/react";
import { ArrowLeftRight, Variable } from "lucide-react";
import type { BaseAttributeFieldProps, NumberFieldProps } from "../model/types";
import { AppNumberField } from "@/shared/ui";

export const NumberAttributeField = ({
  attributeKey,
  label,
  unit,
}: NumberFieldProps) => {
  const [isRange, setIsRange] = useState(false);

  return (
    <div key={attributeKey} className="flex flex-col gap-1">
      <Label>
        {label} {unit}
      </Label>
      <div className="flex gap-1">
        {isRange ? (
          <RangeField attributeKey={attributeKey} label={label} />
        ) : (
          <ExactField attributeKey={attributeKey} label={label} />
        )}
        <Tooltip delay={0} closeDelay={0}>
          <Button isIconOnly onPress={() => setIsRange(!isRange)}>
            {isRange ? <Variable /> : <ArrowLeftRight />}
          </Button>
          <Tooltip.Content>
            <p>{isRange ? "Число" : "Диапазон"}</p>
          </Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
};

const ExactField = ({ attributeKey, label }: BaseAttributeFieldProps) => {
  return (
    <AppNumberField
      aria-label={label}
      name={`${attributeKey}_valueMin`}
      placeholder={label}
    />
  );
};

const RangeField = ({ attributeKey, label }: BaseAttributeFieldProps) => {
  return (
    <div className="flex gap-1">
      <AppNumberField
        aria-label={label}
        name={`${attributeKey}_valueMin`}
        placeholder="Минимум"
      />
      <AppNumberField
        aria-label={label}
        name={`${attributeKey}_valueMax`}
        placeholder="Максимум"
      />
    </div>
  );
};
