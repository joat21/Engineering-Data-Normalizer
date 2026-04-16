import { Button, SearchField } from "@heroui/react";
import { useState } from "react";

interface SearchProps {
  searchText: string | undefined;
  onSearch: (value: string | undefined) => void;
  onClear: () => void;
}

export const Search = ({ searchText, onSearch, onClear }: SearchProps) => {
  const [value, setValue] = useState(searchText);

  return (
    <div className="flex gap-2 max-w-100 w-full">
      <SearchField
        value={value}
        onChange={(value) => setValue(value)}
        onSubmit={(value) => onSearch(value)}
        onClear={onClear}
        variant="secondary"
        fullWidth
        aria-label="Поиск"
      >
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Поиск по каталогу" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Button onPress={() => onSearch(value)}>Найти</Button>
    </div>
  );
};
