export const ImportStep = {
  TYPE_SELECTION: "TYPE_SELECTION",
  IMPORT: "IMPORT",
} as const;

export type ImportStep = (typeof ImportStep)[keyof typeof ImportStep];
