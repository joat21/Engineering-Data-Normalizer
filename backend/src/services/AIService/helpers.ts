import {
  AIParseTarget,
  TransformPayload,
} from "@engineering-data-normalizer/shared";

const PARSING_RULES = `
Правила:
- Если параметр отсутствует или ты не уверен — пиши null
- Неправильно заполненный атрибут хуже null
- НЕ повторяй значения
- Значения должны быть короткими (только число или слово)
- В ответе sourceString указывай отдельно от rowId
`;

export const generatePrompts = (
  lines: {
    id: string;
    text: TransformPayload;
  }[],
  targets: AIParseTarget[],
  categoryName: string,
) => {
  const systemPrompt = `
  Ты — экспертный инструмент для парсинга инженерной номенклатуры категории ${categoryName}.
  Твоя задача: извлекать технические характеристики из строк номенклатуры.
  Если параметр отсутствует или ты не уверен — пиши null.
  НЕ повторяй значения. Значения должны быть короткими (только число или слово).
  `.trim();

  const prompt = `
  ${PARSING_RULES}

  Атрибуты для извлечения:
  ${targets.map((t) => `- ${t.key} (${t.label})`).join("\n")}

  Строки для парсинга:
  ${lines.map((l) => `${l.id}: ${l.text}`).join("\n")}
  `.trim();

  return { systemPrompt, prompt };
};
