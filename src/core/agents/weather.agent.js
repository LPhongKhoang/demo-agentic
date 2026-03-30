import { Agent, run, OpenAIChatCompletionsModel } from '@openai/agents';
import { getWeatherTool } from '../tools/get-weather.js';
import { openAIGeminiClient } from '../ai-model/gemini.model.js';


export const weatherAgent = new Agent({
  name: 'Weather',
  instructions:
    'You provide assistance with weather queries. Explain current weather conditions and forecasts clearly.',
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview'),
  tools: [getWeatherTool],
});



async function exampleUsage() {

  const result = await run(weatherAgent, [
    {
      role: 'user',
      content: 'What is the current weather in New York City?',
    }
  ]);

  console.log('Agent finished.');

  console.log(result.finalOutput);
}

