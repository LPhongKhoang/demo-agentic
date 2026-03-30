
import { openAIGeminiClient } from './src/core/ai-model/gemini.model.js';

async function test() {
  try {
    const response = await openAIGeminiClient.chat.completions.create({
      model: 'gemini-1.5-flash',
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
