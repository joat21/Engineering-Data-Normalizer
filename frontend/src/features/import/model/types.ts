export const SingleImportStep = {
  TYPE_SELECTION: "TYPE_SELECTION",
  FILL_ATTRIBUTES: "FILL_ATTRIBUTES",
} as const;

export type SingleImportStep =
  (typeof SingleImportStep)[keyof typeof SingleImportStep];

export const CatalogImportStep = {
  TYPE_SELECTION: "TYPE_SELECTION",
  INIT_TABLE: "INIT_TABLE",
  MAP_COLUMNS: "MAP_COLUMNS",
};

export type CatalogImportStep =
  (typeof CatalogImportStep)[keyof typeof CatalogImportStep];

export interface BaseReferenceEntity {
  id: string;
  name: string;
}
