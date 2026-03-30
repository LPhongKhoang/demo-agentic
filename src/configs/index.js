import dotenv from 'dotenv';

dotenv.config();

export const CONFIGS = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  }
}