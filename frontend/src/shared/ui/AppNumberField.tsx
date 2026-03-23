import { NumberField, Label, type NumberFieldProps } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

interface AppNumberFieldProps extends NumberFieldProps {
  label?: string;
  unit?: string | null;
  icon?: LucideIcon;
  placeholder?: string;
  showButtons?: boolean;
}

export const AppNumberField = ({
  label,
  unit,
  icon: Icon,
  showButtons = true,
  placeholder,
  ...props
}: AppNumberFieldProps) => {
  return (
    <NumberField {...props} className="w-full">
      {label && (
        <Label>
          {label}
          {unit && <span className="text-tiny text-default-400">({unit})</span>}
        </Label>
      )}
      <NumberField.Group>
        {showButtons && <NumberField.DecrementButton />}
        <NumberField.Input placeholder={placeholder} />
        {showButtons && <NumberField.IncrementButton />}
      </NumberField.Group>
    </NumberField>
  );
};
