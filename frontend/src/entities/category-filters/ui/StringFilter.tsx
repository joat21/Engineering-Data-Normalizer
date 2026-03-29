import { memo } from "react";
import { OptionsList } from "./OptionsList";
import type { FilterFieldProps } from "../model/types";

export const StringFilter = memo((props: FilterFieldProps) => {
  return <OptionsList {...props} />;
});
