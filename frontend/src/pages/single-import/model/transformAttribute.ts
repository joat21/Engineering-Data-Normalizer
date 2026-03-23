import type {
  DataType,
  NormalizedValue,
} from "@engineering-data-normalizer/shared";

interface TransformAttributeArgs {
  formData: FormData;
  attrKey: string;
  dataType: DataType;
}

export const transformAttribute = ({
  formData,
  attrKey,
  dataType,
}: TransformAttributeArgs) => {
  switch (dataType) {
    case "STRING":
      return transformStringAttribute(formData, attrKey);
    case "NUMBER":
      return transformNumberAttribute(formData, attrKey);
    case "BOOLEAN":
      return transformBooleanAttribute(formData, attrKey);
  }
};

const transformStringAttribute = (formData: FormData, attrKey: string) => {
  const strVal = String(formData.get(attrKey) ?? "");
  const rawValue = strVal;
  const normalized: NormalizedValue = { valueString: strVal };

  return { normalized, rawValue };
};

const transformNumberAttribute = (formData: FormData, attrKey: string) => {
  let rawValue = "";
  let normalized: NormalizedValue = { valueString: "" };

  const rawMin = formData.get(`${attrKey}_valueMin`) ?? "";
  const rawMax = formData.get(`${attrKey}_valueMax`) ?? "";

  let min = rawMin !== "" ? Number(rawMin) : null;
  let max = rawMax !== "" ? Number(rawMax) : null;

  if (min === null && max === null) {
    return { normalized, rawValue };
  }

  if (min !== null && max === null) max = min;
  if (max !== null && min === null) min = max;

  rawValue = min === max ? `${min}` : `${min} - ${max}`;
  normalized = {
    valueMin: min ?? undefined,
    valueMax: max ?? undefined,
    valueString: rawValue,
  };

  return { normalized, rawValue };
};

const transformBooleanAttribute = (formData: FormData, attrKey: string) => {
  const boolVal = formData.get(attrKey) === "on";
  const rawValue = boolVal ? "Да" : "Нет";
  const normalized: NormalizedValue = {
    valueString: rawValue,
    valueBoolean: boolVal,
  };

  return { normalized, rawValue };
};
