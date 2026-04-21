import type {
  CategoryAttribute,
  NormalizedValue,
} from "@engineering-data-normalizer/shared";

interface TransformAttributeArgs {
  data: Record<string, any>;
  attr: CategoryAttribute;
}

export const transformAttribute = ({ data, attr }: TransformAttributeArgs) => {
  switch (attr.dataType) {
    case "STRING":
      return transformStringAttribute(data, attr);
    case "NUMBER":
      return transformNumberAttribute(data, attr.id);
    case "BOOLEAN":
      return transformBooleanAttribute(data, attr.id);
  }
};

const transformStringAttribute = (
  data: Record<string, any>,
  attr: CategoryAttribute,
) => {
  const strVal = String(data[attr.id] ?? "");
  let rawValue = strVal;
  let normalized: NormalizedValue = { valueString: strVal };

  if (attr.options.length) {
    const selectedOption = attr.options.find((o) => o.id === strVal);

    if (selectedOption) {
      rawValue = selectedOption.normalized.valueString;
      normalized = selectedOption.normalized;
    }
  }

  return { normalized, rawValue };
};

const transformNumberAttribute = (
  data: Record<string, any>,
  attrKey: string,
) => {
  let rawValue = "";
  let normalized: NormalizedValue = { valueString: "" };

  const rawMin = String(data[`${attrKey}_valueMin`] ?? "");
  const rawMax = String(data[`${attrKey}_valueMax`] ?? "");

  let min = rawMin !== "" ? Number(rawMin) : null;
  let max = rawMax !== "" ? Number(rawMax) : null;

  if (min === null && max === null) {
    return { normalized, rawValue };
  }

  if (min !== null && max === null) max = min;
  if (max !== null && min === null) min = max;

  rawValue = min === max ? `${min}` : `${min} - ${max}`;
  return {
    rawValue,
    normalized: {
      valueMin: min ?? undefined,
      valueMax: max ?? undefined,
      valueString: rawValue,
    },
  };
};

const transformBooleanAttribute = (
  data: Record<string, any>,
  attrKey: string,
) => {
  const boolVal = !!data[attrKey];
  const rawValue = boolVal ? "Да" : "Нет";
  const normalized: NormalizedValue = {
    valueString: rawValue,
    valueBoolean: boolVal,
  };

  return { normalized, rawValue };
};
