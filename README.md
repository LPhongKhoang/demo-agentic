
# My Starter Agentic

A minimal agentic CLI example demonstrating the use of `@openai/agents` with a Google Gemini-compatible OpenAI client. This project provides a small weather assistant agent and a command-line chat interface that preserves conversation history.

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

	Then type questions like "What's the weather in Paris?". Type `exit` or `quit` to end the session.

**What this project contains**

- **`src/index.js`**: CLI entrypoint — simple readline-based chat that sends the full chat history to the agent each turn.
- **`src/core/agents/weather.agent.js`**: Agent definition using `@openai/agents`, configured to use a Gemini-compatible OpenAI client and the `get-weather` tool.
- **`src/core/tools/get-weather.js`**: A Zod-validated tool that simulates fetching weather data (example implementation).
- **`src/core/ai-model/gemini.model.js`**: Client setup for Gemini via the OpenAI-compatible base URL.
- **`src/app/`**: Example scripts and experimental agents.

**Behavior & Features**

- Conversation context: the CLI stores chat messages in a `chatHistory` array and passes it to the agent every turn so the agent can answer follow-ups.
- Tooling: an example `get-weather` tool shows how to register and validate tool parameters using Zod.

**Development notes**

- The project uses ES modules (`type: "module"` in `package.json`).
- To modify or add agents, follow the pattern in `src/core/agents/` and tools in `src/core/tools/`.
- Linting is available via `npm run lint` (requires a configured ESLint environment).

**Known limitations**

- The `get-weather` tool currently returns mocked data for demonstration. Replace or extend it to call a real weather API if needed.
- There is no automated test suite included.

**Next steps you might want**

- Integrate a real weather API (e.g., OpenWeatherMap) and secure API keys with environment variables.
- Add unit tests for the tool and agent behaviors.
- Add more agents/tools and an agent selector in the CLI.

**License**

- MIT

