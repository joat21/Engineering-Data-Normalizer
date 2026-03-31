import { memo } from "react";
import { StringFilter } from "./StringFilter";
import { NumberFilter } from "./NumberField";
import { BooleanFilter } from "./BooleanFilter";
import type { FilterFieldProps } from "../model/types";

export const FilterField = memo((props: FilterFieldProps) => {
  const renderFilter = () => {
    switch (props.filter.type) {
      case "STRING":
        return <StringFilter {...props} />;
      case "NUMBER":
        return <NumberFilter {...props} />;
      case "BOOLEAN":
        return <BooleanFilter {...props} />;
      default:
        return null;
    }
  };

  return <div className="pb-3 pl-3">{renderFilter()}</div>;
});
