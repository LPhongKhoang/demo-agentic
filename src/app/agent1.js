import { Agent, run, setDefaultOpenAIClient, OpenAIChatCompletionsModel } from '@openai/agents';
import { openAIGeminiClient } from '../core/ai-model/gemini.model.js';


// geminiClient.get

console.log('Setting Gemini client as default OpenAI client for agents...');
setDefaultOpenAIClient(openAIGeminiClient);

console.log('Creating agent...');
const agent = new Agent({
  name: 'History Tutor',
  instructions:
    'You provide assistance with historical queries. Explain important events and context clearly.',
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview')
});

console.log('Starting agent...');

const result = await run(agent, 'Top 10 vị vua của Trung Quốc là ai? Hãy liệt kê và giải thích ngắn gọn về mỗi vị vua.');

console.log('Agent finished.');

console.log(result.finalOutput);