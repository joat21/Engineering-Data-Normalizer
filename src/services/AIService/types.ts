import z from "zod";
import { aiParseTargetSchema, editedAiParseResult } from "../../schemas/ai";

export type ParseTarget = z.infer<typeof aiParseTargetSchema>;

export type EditedAiParseResult = z.infer<typeof editedAiParseResult>;
