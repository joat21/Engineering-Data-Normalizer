import { MappingTarget } from "@engineering-data-normalizer/shared";
import { enrichIssuesWithOptions } from "../helpers";
import { buildTransformedRows, saveTransformedRows } from "./builders";

export const executeUpdatePipeline = async (params: {
  items: any[];
  colIndex: number;
  subIndex?: number;
  targets: (MappingTarget | null)[];
  updatedValuesByItem: Map<string, string[]>;
  rawValueByItem: Map<string, string>;
}) => {
  const {
    items,
    colIndex,
    subIndex,
    targets,
    updatedValuesByItem,
    rawValueByItem,
  } = params;

  const { transformedRows, issues: rawIssues } = await buildTransformedRows({
    items,
    colIndex,
    subIndex,
    updatedValuesByItem,
    rawValueByItem,
    targets,
  });

  if (transformedRows.length === 0) {
    return { count: 0, issues: [] };
  }

  const issues = await enrichIssuesWithOptions(rawIssues);

  await saveTransformedRows(transformedRows);

  return {
    count: transformedRows.length,
    issues,
  };
};
