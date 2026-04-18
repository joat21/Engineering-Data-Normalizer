import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { GoogleGenAI, Schema, ThinkingLevel, Type } from "@google/genai";
import z from "zod";
import {
  AIParseTarget,
  TransformPayload,
} from "@engineering-data-normalizer/shared";
import { generatePrompts } from "./helpers";
import { AiParseResult } from "./types";

interface Result {
  tokensUsage: object | string;
  parsed: AiParseResult[];
  responseText: string;
  modelName: string;
}

export const llmParse = async (
  lines: {
    id: string;
    text: TransformPayload;
  }[],
  targets: AIParseTarget[],
  categoryName: string,
): Promise<AiParseResult[]> => {
  const { systemPrompt, prompt } = generatePrompts(
    lines,
    targets,
    categoryName,
  );

  // const { tokensUsage, parsed, responseText } = await googleAiParse(systemPrompt, prompt, targets);
  const { tokensUsage, parsed, responseText, modelName } = await yandexAiParse(
    systemPrompt,
    prompt,
    targets,
  );

  console.log(
    `[LOG]: ${new Date(Date.now()).toLocaleString()}\nTOKENS USAGE:`,
    tokensUsage,
  );
  console.log(`[LOG]: Model:\n${modelName}`);
  console.log(`[LOG]: System Prompt:\n${systemPrompt}`);
  console.log(`[LOG]: Prompt:\n${prompt}`);
  console.log(`[LOG]: Response text:\n${responseText}`);

  return parsed;
};

const yandexAiParse = async (
  systemPrompt: string,
  prompt: string,
  targets: AIParseTarget[],
): Promise<Result> => {
  const modelName = "qwen3.5-35b-a3b-fp8/latest";
  // const modelName = "aliceai-llm/latest";

  const client = new OpenAI({
    apiKey: process.env.YANDEX_CLOUD_API_KEY,
    baseURL: "https://ai.api.cloud.yandex.net/v1",
    defaultHeaders: {
      "OpenAI-Project": process.env.YANDEX_CLOUD_FOLDER,
    },
  });

  const extractedShape = targets.reduce(
    (acc, t) => {
      acc[t.key] = z.string().nullable();
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>,
  );

  const engineeringSchema = z.object({
    items: z.array(
      z.object({
        rowId: z.string(),
        sourceString: z.string(),
        extracted: z.object(extractedShape),
      }),
    ),
  });

  const response = await client.responses.parse({
    model: `gpt://${process.env.YANDEX_CLOUD_FOLDER}/${modelName}`,
    instructions: systemPrompt,
    input: prompt,
    temperature: 0,
    reasoning: {
      effort: "none",
    },
    text: {
      format: zodTextFormat(engineeringSchema, "EngineeringParser"),
    },
  });

  console.log(response);

  return {
    tokensUsage: response.usage ?? "No tokens usage metadata",
    parsed: response.output_parsed?.items as AiParseResult[],
    responseText: response.output_text,
    modelName,
  };
};

const googleAiParse = async (
  systemPrompt: string,
  prompt: string,
  targets: AIParseTarget[],
): Promise<Result> => {
  const modelName = "gemini-3.1-flash-lite-preview";
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        sourceString: { type: Type.STRING },
        rowId: { type: Type.STRING },
        extracted: {
          type: Type.OBJECT,
          properties: targets.reduce(
            (acc, t) => {
              acc[t.key] = { type: Type.STRING, nullable: true };
              return acc;
            },
            {} as Record<string, any>,
          ),
        },
      },
      required: ["sourceString", "rowId", "extracted"],
    },
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
      },
      systemInstruction: systemPrompt,
    },
  });

  return {
    parsed: JSON.parse(response.text || "") as AiParseResult[],
    tokensUsage: response.usageMetadata ?? "No tokens usage metadata",
    responseText: response.text ?? "No response text",
    modelName,
  };
};
