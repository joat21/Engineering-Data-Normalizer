import { Button, Input, Label, Tooltip } from "@heroui/react";
import { List, Plus } from "lucide-react";
import { AppSelect } from "@/shared/ui";
import { useState } from "react";

interface ReferenceFieldProps {
  label: string;
  name: string;
  items: {
    id: string;
    name: string;
  }[];
}

export const ReferenceField = ({ label, name, items }: ReferenceFieldProps) => {
  const [isManual, setIsManual] = useState(false);

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={name} className="text-lg">
        {label}
      </Label>
      <div className="flex gap-1">
        {isManual ? (
          <Input
            id={name}
            name={`${name}Name`}
            placeholder={label}
            className="w-full"
            variant="secondary"
          />
        ) : (
          <AppSelect
            id={name}
            name={`${name}Id`}
            items={items}
            getItemKey={(m) => m.id}
            getItemLabel={(m) => m.name}
            className="w-full"
            variant="secondary"
          />
        )}
        <Tooltip delay={0} closeDelay={0}>
          <Button isIconOnly onPress={() => setIsManual((prev) => !prev)}>
            {isManual ? <List /> : <Plus />}
          </Button>
          <Tooltip.Content>
            <p>{isManual ? "Выбрать из списка" : "Ввести вручную"}</p>
          </Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
};
