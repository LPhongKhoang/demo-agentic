import { tool } from "@openai/agents";
import { z } from "zod";

export const getWeatherTool = tool({
  name: "get-weather",
  description: "Get the current weather for a given location.",
  parameters: z.object({ city: z.string() }),
  execute: async (location) => {
    // Simulate fetching weather data
    return `The current weather in ${location} is sunny with a temperature of 25°C.`;
  },
});