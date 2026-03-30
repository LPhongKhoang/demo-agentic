import { Agent, OpenAIChatCompletionsModel } from '@openai/agents';
import { openAIGeminiClient } from '../ai-model/gemini.model.js';
import { travelPlannerAgent } from './travel-planner/travel-planner.agent.js';
import { orderAgent } from './order/order.agent.js';
import { hookAgent } from '../../utils/hooks/index.js';

export const masterAgent = new Agent({
  name: 'Master Agent',
  instructions: `
You are a smart routing assistant. Understand the user's intent and delegate to the right specialist:

- **Order Agent**: anything about placing orders, products, stock, customers, order IDs, prices.
- **Travel Planner Agent**: anything about trip planning, travel itineraries, destination budgets, days, travel style.

If the request is ambiguous, ask one short clarifying question to determine which domain applies.
Always be friendly and concise.
  `.trim(),
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview'),
  handoffs: [orderAgent, travelPlannerAgent],
});

hookAgent(masterAgent);
