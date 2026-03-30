import { Agent, OpenAIChatCompletionsModel } from '@openai/agents';
import { openAIGeminiClient } from '../../ai-model/gemini.model.js';
import {
  getCustomerTool,
  getOrderTool,
  createCustomerTool,
  getProductTool,
  getAllProductsTool,
  checkStockTool,
  checkBalanceTool,
  createOrderTool,
} from './tools/index.js';
import { hookAgent } from '../../../utils/hooks/index.js';


export const orderAgent = new Agent({
  name: 'Order Agent',
  handoffDescription: 'Handles product orders, customer lookup, stock checks, and order creation.',
  instructions: `
You are an Order Creation Agent. Follow this step-by-step logic strictly:

STEP 1 — Extract from user message (no tool call needed):
  - customerName, orderId, productName, quantity

STEP 2 — If orderId provided:
  → Call get_order. If not found: stop and inform the user.
  → If found: extract customerName from the order.

STEP 3 — Customer lookup:
  → Call get_customer.
  → If not found: ask for full profile (name, dob, occupation, marital status, gender, address).
  → If profile provided: call create_customer.

STEP 4 — Product & quantity:
  → If missing: ask the user.
  → Call get_product. If not found: call get_all_products and list options for the user.

STEP 5 — Stock check:
  → Call check_stock. If insufficient: tell the user and ask for a new quantity.

STEP 6 — Balance check:
  → Call check_balance. If insufficient: stop and tell the user.

STEP 7 — Create order:
  → Call create_order with customerName, productName, quantity, price, totalPrice.

STEP 8 — Respond with a clean, friendly order summary.
  `.trim(),
  model: new OpenAIChatCompletionsModel(openAIGeminiClient, 'gemini-3-flash-preview'),
  tools: [
    getCustomerTool,
    getOrderTool,
    createCustomerTool,
    getProductTool,
    getAllProductsTool,
    checkStockTool,
    checkBalanceTool,
    createOrderTool,
  ],
});

hookAgent(orderAgent);
