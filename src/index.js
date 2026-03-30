import readline from 'readline';
import { run } from '@openai/agents';
import { masterAgent } from './core/agents/master.agent.js';
import { logger } from './utils/logger.js';

const COMMANDS = Object.freeze({
  exit: '/exit',
  history: '/history',
  reset: '/reset',
  help: '/help',
});

const HELP_TEXT = `
Available commands:
  /exit     — End the session
  /history  — Print last 10 messages in conversation history
  /reset    — Clear conversation history
  /help     — Show this help message

Otherwise just type anything — the assistant will route your request automatically.
`.trim();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\nYou> ',
});

const chatHistory = [];
let isProcessing = false;

logger.logResponse('🤖 Multi-Agent Assistant is ready.', 'system');
logger.logResponse('Specialist agents: Order Agent · Travel Planner Agent', 'system');
logger.logResponse('Type /help to see available commands.\n', 'system');

rl.prompt();

const handleCommand = (command) => {
  switch (command) {
    case COMMANDS.exit:
      logger.logResponse(`Session ended. Total messages: ${chatHistory.length}`, 'system');
      rl.close();
      break;
    case COMMANDS.history:
      logger.logResponse(`Last ${Math.min(chatHistory.length, 10)} messages:`, 'system');
      logger.debug('chat history', JSON.stringify(chatHistory.slice(-10), null, 2));
      break;
    case COMMANDS.reset:
      chatHistory.length = 0;
      logger.logResponse('Conversation history cleared.', 'system');
      break;
    case COMMANDS.help:
      logger.logResponse(HELP_TEXT, 'system');
      break;
    default:
      logger.logResponse('Unknown command. Type /help for the list of commands.', 'system');
  }
};

rl.on('line', async (input) => {
  const userMessage = input.trim();

  if (!userMessage) {
    rl.prompt();
    return;
  }

  if (userMessage.startsWith('/')) {
    handleCommand(userMessage);
    if (userMessage === COMMANDS.exit) {
      return;
    }
    rl.prompt();
    return;
  }

  if (isProcessing) {
    logger.logResponse('Agent is processing your previous message, please wait…', 'system');
    return;
  }

  isProcessing = true;
  chatHistory.push({ role: 'user', content: userMessage });

  try {
    const result = await run(masterAgent, chatHistory);
    chatHistory.push({ role: 'assistant', content: result.finalOutput });
    logger.logResponse(result.finalOutput, 'assistant');
  } catch (error) {
    logger.logResponse(`Error: ${error.message}`, 'system');
    chatHistory.pop();
  } finally {
    isProcessing = false;
    rl.prompt();
  }
});

rl.on('close', () => {
  logger.logResponse('👋 Goodbye!', 'system');
  process.exit(0);
});
