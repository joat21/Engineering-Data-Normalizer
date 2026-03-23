import type { DataType } from "@engineering-data-normalizer/shared";

export interface BaseAttributeFieldProps {
  attributeKey: string;
  label: string;
}

export interface StringFieldProps extends BaseAttributeFieldProps {}

export interface NumberFieldProps extends BaseAttributeFieldProps {
  unit: string | null;
}

export interface BooleanFieldProps extends BaseAttributeFieldProps {}

export type AttributeFieldProps =
  | (StringFieldProps & { dataType: typeof DataType.STRING })
  | (NumberFieldProps & { dataType: typeof DataType.NUMBER })
  | (BooleanFieldProps & { dataType: typeof DataType.BOOLEAN });
