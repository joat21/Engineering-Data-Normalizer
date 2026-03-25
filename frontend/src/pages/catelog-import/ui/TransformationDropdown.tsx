import { Button, Dropdown, Label, type Key } from "@heroui/react";
import { WandSparkles } from "lucide-react";
import { TransformationType } from "../model/types";
import { memo } from "react";

interface TransformationDropdownProps {
  onAction?: (key: Key) => void;
}

export const TransformationDropdown = memo(
  ({ onAction }: TransformationDropdownProps) => {
    return (
      <Dropdown>
        <Button isIconOnly>
          <WandSparkles />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={onAction}>
            <Dropdown.Item
              id={TransformationType.EXTRACT_NUMBERS}
              textValue="Извлечь числа"
            >
              <Label>Извлечь числа</Label>
            </Dropdown.Item>
            <Dropdown.Item
              id={TransformationType.SPLIT_BY}
              textValue="Разбить по символу"
            >
              <Label>Разбить по символу</Label>
            </Dropdown.Item>
            <Dropdown.Item
              id={TransformationType.AI_PARSE}
              textValue="ИИ-анализ"
            >
              <Label>ИИ-анализ</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    );
  },
);
