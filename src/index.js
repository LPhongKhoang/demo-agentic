import readline from 'readline';
import { run } from '@openai/agents';
import { weatherAgent } from './core/agents/weather.agent.js';

// Create readline interface for CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You: ',
});

// Store chat history
const chatHistory = [];

console.log('🤖 Weather Agent Chat');
console.log('Ask me anything about the weather! (Type "exit" or "quit" to end)\n');

// Display the prompt
rl.prompt();

// Handle user input
rl.on('line', async (input) => {
  const userMessage = input.trim();

  // Exit conditions
  if (["exit", "quit"].includes(userMessage.toLowerCase())) {
    console.log('\n👋 Goodbye!');
    console.log(`\n📊 Total messages in history: ${chatHistory.length}`);
    rl.close();
    process.exit(0);
  }

  // Skip empty messages
  if (!userMessage) {
    rl.prompt();
    return;
  }

  try {
    // Add user message to chat history
    chatHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Send message to the weather agent with full chat history
    console.log('\n🤖 Agent:');
    
    const result = await run(weatherAgent, chatHistory);
    
    // Display the agent's response
    console.log(result.finalOutput);
    console.log();

    // Add agent response to chat history
    chatHistory.push({
      role: 'assistant',
      content: result.finalOutput,
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log();
    // Remove the last user message if there was an error
    chatHistory.pop();
  }

  // Show prompt again
  rl.prompt();
});

// Handle readline close
rl.on('close', () => {
  console.log('\n👋 Goodbye!');
  process.exit(0);
});
