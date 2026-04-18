export type AiParseResult = {
  rowId: string;
  sourceString: string;
  extracted: Record<string, string | number | boolean | null>;
};

export type ParseResultData = {
  tokensUsage: object | string;
  parsed: AiParseResult[];
  responseText: string;
  modelName: string;
};
