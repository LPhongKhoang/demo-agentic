# AI Coding Agent Instructions

## Project Overview
This is an agentic AI application using the `@openai/agents` SDK with Google Gemini as the LLM provider (via OpenAI-compatible API). The project demonstrates tool-calling agents with a weather query example and CLI-based chat interface.

## Architecture Pattern

### Three-Layer Structure
- **`src/index.js`**: CLI entry point with readline interface for interactive chat
- **`src/core/agents/`**: Agent definitions using `@openai/agents` SDK
- **`src/core/tools/`**: Zod-validated tool definitions for agent capabilities
- **`src/core/ai-model/`**: LLM client configuration (Gemini via OpenAI API)
- **`src/configs/`**: Centralized environment variable management
- **`src/app/`**: Experimental/example agent scripts

### Key Integration: Gemini via OpenAI SDK
The project uses Google Gemini models through OpenAI's SDK by setting a custom `baseURL`:
```javascript
const client = new OpenAI({
  apiKey: CONFIGS.gemini.apiKey,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});
```
Model names follow Gemini naming: `'gemini-1.5-flash'` or `'gemini-3-flash-preview'`.

## Development Workflows

**Run the main CLI agent:**
```bash
npm run dev
```
Interactive weather agent with chat history. Type "exit" or "quit" to end session.

**Test Gemini connection:**
```bash
node test-gemini.js
```

**Lint code:**
```bash
npm run lint
```

## Critical Patterns

### Agent Creation
Agents require three core components from `@openai/agents`:
1. **Agent definition** with name, instructions, model, and tools
2. **Model wrapper**: `new OpenAIChatCompletionsModel(client, modelName)`
3. **Execution**: `await run(agent, messages)` where messages is an array with chat history

Example from [src/core/agents/weather.agent.js](src/core/agents/weather.agent.js):
```javascript
export const weatherAgent = new Agent({
  name: 'Weather',
  instructions: 'You provide assistance with weather queries...',
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview'),
  tools: [getWeatherTool]
});
```

### Tool Definition
All tools use Zod for parameter validation via the `tool()` helper. See [src/core/tools/get-weather.js](src/core/tools/get-weather.js):
```javascript
export const getWeatherTool = tool({
  name: "get-weather",
  description: "Get the current weather for a given location.",
  parameters: z.object({ city: z.string() }),
  execute: async (location) => { /* implementation */ }
});
```

### Chat History Management
The main CLI in [src/index.js](src/index.js) maintains a `chatHistory` array with role-based messages. The full history is passed to `run()` on each turn to maintain conversation context. Errors trigger a `chatHistory.pop()` to remove failed user messages.

## Project Conventions

- **ES Modules only**: `"type": "module"` in package.json. Use `.js` extensions in all imports.
- **File naming**: Kebab-case with semantic suffixes: `*.agent.js`, `*.tool.js`, `*.model.js`
- **Configuration**: Environment variables loaded via dotenv, centralized in `src/configs/index.js`
- **Error handling**: Try-catch blocks with user-friendly console messages (emojis included: 🤖, ❌, 👋, 📊)
- **ESLint rules**: Enforces ES6+ (no var, prefer const, arrow functions), semicolons required

## Environment Setup
Requires `.env` file with:
```
GEMINI_API_KEY=your_api_key_here
OPENAI_API_KEY=optional_for_future_use
```

## Adding New Agents
1. Create agent file in `src/core/agents/` exporting an `Agent` instance
2. Define tools in `src/core/tools/` using Zod schemas
3. Import the Gemini client from `src/core/ai-model/gemini.model.js`
4. For CLI integration, update `src/index.js` to import and use your agent

## Known Limitations
- No test suite implemented yet (`npm test` exits with error)
- Weather tool returns mocked data (not real API calls)
- Single-agent CLI design (switching agents requires code changes)
