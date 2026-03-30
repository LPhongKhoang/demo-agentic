

# My Starter Agentic

A minimal agentic CLI example demonstrating how to build small, tool-enabled agents using `@openai/agents` with a Gemini-compatible OpenAI client. The repository includes example agents and tools (travel planner, budgeting) and a simple CLI that preserves conversation history.

## Quick Start

- Install dependencies:

  ```bash
  npm install
  ```

- Add credentials: create a `.env` file in the project root with your Gemini API key (see `src/configs/index.js`):

  ```text
  GEMINI_API_KEY=your_api_key_here
  ```

- Run the CLI:

  ```bash
  npm run dev
  ```

  Then type prompts such as "Plan a 5-day trip to Tokyo for 2 people with a standard budget". Type `exit` or `quit` to end the session.

## Project Structure

- `src/index.js` — CLI entrypoint: a readline-based chat that sends the full `chatHistory` to the active agent each turn.
- `src/core/agents/` — Agent definitions (examples: `travel-planner.agent.js`, `weather.agent.js`).
- `src/core/tools/` — Zod-validated tool implementations (examples: itinerary planner, budget estimator, get-weather mock).
- `src/core/ai-model/gemini.model.js` — Gemini/OpenAI client configuration used by agents.
- `src/app/` — Example scripts and experimental agents.

## Features

- Conversation context: the CLI maintains a `chatHistory` array and provides it to agents so they can answer follow-up questions.
- Tooling examples: demonstrates registering tools with Zod validation and using them from agents.

## Development notes

- This repo uses ES modules (`type: "module"` in `package.json`).
- To add an agent: create a new file under `src/core/agents/` following the existing agent patterns.
- To add a tool: create a new Zod-validated tool under `src/core/tools/` and register it with the agent.

## Known limitations

- Many example tools use mocked or rule-based logic for demonstration; they are not production-ready.
- No automated test suite is included by default.

## Suggested next steps

- Integrate real data providers (flight/hotel APIs, maps, weather) and secure keys with environment variables.
- Add unit tests and CI linting hooks.
- Add an agent-selection menu to the CLI to switch between multiple agents.

## License

- MIT

