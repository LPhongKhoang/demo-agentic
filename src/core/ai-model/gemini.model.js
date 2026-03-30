import OpenAI from "openai";
import { CONFIGS } from "../../configs/index.js";

// 1. Initialize the Gemini-compatible client
export const openAIGeminiClient = new OpenAI({
  apiKey: CONFIGS.gemini.apiKey,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});