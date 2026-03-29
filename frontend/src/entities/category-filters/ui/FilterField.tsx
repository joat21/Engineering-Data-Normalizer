import { memo } from "react";
import { StringFilter } from "./StringFilter";
import { NumberFilter } from "./NumberField";
import { BooleanFilter } from "./BooleanFilter";
import type { FilterFieldProps } from "../model/types";

export const FilterField = memo((props: FilterFieldProps) => {
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
});
