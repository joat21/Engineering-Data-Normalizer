import { SourceType } from "@engineering-data-normalizer/shared";

export const ACCEPTED_FORMATS = {
  [SourceType.CATALOG]: [".xlsx", ".xls"],
  [SourceType.SINGLE_ITEM]: [".pdf", ".docx", ".doc"],
};
