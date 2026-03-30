
# My Starter Agentic

A minimal agentic CLI example demonstrating the use of `@openai/agents` with a Google Gemini-compatible OpenAI client. This project now provides a travel planning and budgeting assistant with a command-line chat interface that preserves conversation history.

**Quick Start**

- **Install dependencies:**

	```bash
	npm install
	```

- **Add credentials:** create a `.env` file in the project root with your Gemini API key (see `src/configs/index.js`):

	```text
	GEMINI_API_KEY=your_api_key_here
	```

- **Run the CLI:**

	```bash
	npm run dev
	```

	Then type prompts like "Plan a 5-day trip to Tokyo for 2 people with a standard budget". Type `exit` or `quit` to end the session.

**What this project contains**

- **`src/index.js`**: CLI entrypoint — simple readline-based chat that sends the full chat history to the agent each turn.
- **`src/core/agents/travel-planner.agent.js`**: Agent definition using `@openai/agents`, configured to use a Gemini-compatible OpenAI client and travel tools.
- **`src/core/tools/plan-trip-itinerary.tool.js`**: Zod-validated tool that creates a day-by-day itinerary from destination, trip length, and travel style.
- **`src/core/tools/estimate-trip-budget.tool.js`**: Zod-validated tool that estimates travel budget with category-level breakdown and contingency.
- **`src/core/ai-model/gemini.model.js`**: Client setup for Gemini via the OpenAI-compatible base URL.
- **`src/app/`**: Example scripts and experimental agents.

**Behavior & Features**

- Conversation context: the CLI stores chat messages in a `chatHistory` array and passes it to the agent every turn so the agent can answer follow-ups.
- Tooling: travel itinerary and budgeting tools show how to register and validate tool parameters using Zod.

**Development notes**

- The project uses ES modules (`type: "module"` in `package.json`).
- To modify or add agents, follow the pattern in `src/core/agents/` and tools in `src/core/tools/`.
- Linting is available via `npm run lint` (requires a configured ESLint environment).

**Known limitations**

- Travel tools use rule-based estimation and planning for demonstration. Replace or extend them with real APIs (flight prices, hotel providers, maps/POI data) for production usage.
- There is no automated test suite included.

**Next steps you might want**

- Integrate real travel data providers (flight/hotel/activity APIs) and secure API keys with environment variables.
- Add unit tests for the tool and agent behaviors.
- Add more agents/tools and an agent selector in the CLI.

**License**

- MIT

