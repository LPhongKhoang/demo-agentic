// const gray = (text) => `\x1b[90m${text}\x1b[0m`;

import { logger } from "../logger.js";



/**
 *
 * @param {import("@openai/agents").Agent} agent
 */
export const hookAgent = (agent) => {
  agent.on('agent_start', (ctx, agent) => {
    // console.log(gray(`[${agent.name}] started`));
    logger.debug(`[${agent.name}] started`);
  });
  agent.on('agent_end', (ctx, output) => {
    // console.log(gray(`[agent] produced:`), output);
    logger.debug(`[agent] produced:`, output);
  });

  agent.on('agent_handoff', (ctx, nextAgent) => {
    // console.log(gray(`[${agent.name}] handing off to ${nextAgent.name}`));
    logger.debug(`[${agent.name}] handing off to ${nextAgent.name}`);
  });

  agent.on('agent_tool_start', async (context, tool, { toolCall }) => {
    // console.log(gray(`Agent called tool ${tool.name} with input: ${JSON.stringify(toolCall)}`));
    logger.debug(`Agent called tool ${tool.name} with input: ${JSON.stringify(toolCall)}`);
  });

  agent.on('agent_tool_end', async (context, tool, result) => {
    // console.log(gray(`Tool ${tool.name} returned output: ${JSON.stringify(result)}`));
    logger.debug(`Tool ${tool.name} returned output: ${JSON.stringify(result)}`);
  });
};