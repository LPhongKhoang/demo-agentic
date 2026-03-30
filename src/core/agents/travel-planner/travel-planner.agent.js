import { Agent, OpenAIChatCompletionsModel } from '@openai/agents';
import { openAIGeminiClient } from '../../ai-model/gemini.model.js';
import {
  planTripItineraryTool,
  estimateTripBudgetTool
} from './tools/index.js';
import { hookAgent } from '../../../utils/hooks/index.js';

export const travelPlannerAgent = new Agent({
  name: 'Travel Planner',
  instructions:
    'You are a travel planning and budgeting assistant. Ask concise follow-up questions when user input is missing key trip constraints, then call tools to build a practical itinerary and budget. Always return a clear summary with assumptions, daily plan highlights, budget totals, and 2-4 savings tips.',
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview'),
  tools: [planTripItineraryTool, estimateTripBudgetTool],
});


hookAgent(travelPlannerAgent);
