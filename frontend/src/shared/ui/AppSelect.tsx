import {
  Collection,
  Label,
  ListBox,
  Select,
  type SelectProps,
} from "@heroui/react";

interface AppSelectProps<T extends object> extends Omit<
  SelectProps<T>,
  "children" | "items"
> {
  items: T[];
  isPending?: boolean;
  label?: string;
  getItemKey: (item: T) => string | number;
  getItemLabel: (item: T) => string;
}

export const AppSelect = <T extends object>({
  isPending,
  items,
  label,
  getItemKey,
  getItemLabel,
  ...props
}: AppSelectProps<T>) => {
  return (
    <Select {...props}>
      {label && <Label>{label}</Label>}

      <Select.Trigger isPending={isPending}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          <Collection items={items}>
            {(item) => (
              <ListBox.Item
                id={getItemKey(item)}
                textValue={getItemLabel(item)}
              >
                {getItemLabel(item)}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </Collection>
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
