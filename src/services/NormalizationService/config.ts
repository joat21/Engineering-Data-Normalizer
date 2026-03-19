import { v4 as uuidv4 } from "uuid";

export const booleanNormalizationOptions = [
  {
    id: uuidv4(),
    label: "Да",
    normalized: { valueBoolean: true, valueString: "Да" },
  },
  {
    id: uuidv4(),
    label: "Нет",
    normalized: { valueBoolean: false, valueString: "Нет" },
  },
];
