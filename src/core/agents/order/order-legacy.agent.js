import dotenv from "dotenv";
dotenv.config({
  path: ".env",
  override: true,
});


console.log("OPENAI_API_KEY=====", process.env.OPENAI_API_KEY?.slice(0, 10) + '...');

import readline from "readline";
import { Agent, run, setDefaultOpenAIClient, setOpenAIAPI, tool, withTrace } from "@openai/agents";
import { z } from "zod";
import { AI_MODEL, OPENAI_DICT } from "../core/ai-model.js";
import { MyLogger } from "../utils/logger.js";

const logger = new MyLogger();

// Wrap tool execute functions so we can trace their inputs/outputs centrally.
const withToolLogging = (toolName, fn) => async (params = {}) => {
  logger.debug(`[tool:${toolName}] input`, params);
  try {
    const result = await fn(params);
    logger.debug(`[tool:${toolName}] output`, result);
    return result;
  } catch (error) {
    logger.debug(`[tool:${toolName}] error`, error);
    throw error;
  }
};

//
// ─────────────────────────────────────────────
// MOCK DATABASES
// ─────────────────────────────────────────────
//

const customersDB = [
  {
    name: "John Doe",
    dob: "1990-01-01",
    occupation: "Engineer",
    maritalStatus: "Single",
    gender: "Male",
    address: "123 Main St",
    balance: 5000,
  },
];

const ordersDB = [{ orderId: "ORD1001", customerName: "John Doe" }];

const productsDB = [
  { name: "iPhone 16", stock: 10, price: 1200 },
  { name: "iPad Pro", stock: 5, price: 900 },
  { name: "AirPods Max", stock: 2, price: 600 },
];

const customerProfileSchema = z
  .object({
    name: z.string().min(1, "Customer name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    occupation: z.string().min(1, "Occupation is required"),
    maritalStatus: z.string().min(1, "Marital status is required"),
    gender: z.string().min(1, "Gender is required"),
    address: z.string().min(1, "Address is required"),
    balance: z.number().nonnegative().default(0),
  })
  .strict();

const getCustomerSchema = z.object({ name: z.string().min(1) });
const getOrderSchema = z.object({ orderId: z.string().min(1) });
const getProductSchema = z.object({ name: z.string().min(1) });
const getAllProductsSchema = z.object({}).strict();
const checkStockSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});
const checkBalanceSchema = z.object({
  customerName: z.string().min(1),
  totalPrice: z.number().nonnegative(),
});
const createCustomerSchema = z.object({
  name: z.string().min(1),
  dob: z.string().min(1),
  occupation: z.string().min(1),
  maritalStatus: z.string().min(1),
  gender: z.string().min(1),
  address: z.string().min(1),
  balance: z.number().nonnegative().default(0),
}).strict();

const orderPayloadSchema = z
  .object({
    customerName: z.string().min(1).optional(),
    customerProfile: customerProfileSchema.optional(),
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
  })
  .passthrough();
const createOrderSchema = z.object({
  order: z.object({
    productName: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
  }).strict(),
});

//
// ─────────────────────────────────────────────
// TOOLS
// ─────────────────────────────────────────────
//

// 1. Get customer by name
const getCustomerByNameTool = tool({
  name: "get_customer",
  description: "Find a customer by name in the database.",
  parameters: getCustomerSchema,
  execute: withToolLogging("get_customer", async ({ name }) => {
    return customersDB.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
  }),
});

// 2. Get order by ID
const getOrderByIdTool = tool({
  name: "get_order",
  description: "Return an order by its ID.",
  parameters: getOrderSchema,
  execute: withToolLogging("get_order", async ({ orderId }) => {
    return ordersDB.find((o) => o.orderId === orderId) || null;
  }),
});

// 3. Create customer (when name does not exist)
const createCustomerTool = tool({
  name: "create_customer",
  description: "Create a new customer profile.",
  parameters: createCustomerSchema,
  execute: withToolLogging("create_customer", async (profile) => {
    const normalizedProfile = customerProfileSchema.parse(profile);
    customersDB.push(normalizedProfile);
    return normalizedProfile;
  }),
});

// 4. Get product by name
const getProductTool = tool({
  name: "get_product",
  description: "Return product details if existing.",
  parameters: getProductSchema,
  execute: withToolLogging("get_product", async ({ name }) => {
    return productsDB.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
  }),
});

// 5. Get full product list
const getAllProductsTool = tool({
  name: "get_all_products",
  description: "Return all product names.",
  parameters: getAllProductsSchema,
  execute: withToolLogging("get_all_products", async () => {
    return productsDB.map((p) => p.name);
  }),
});  

// 6. Stock check
const checkStockTool = tool({
  name: "check_stock",
  description: "Check if product has enough stock.",
  parameters: checkStockSchema,
  execute: withToolLogging("check_stock", async ({ name, quantity }) => {
    const product = productsDB.find((p) => p.name === name);
    return product && product.stock >= quantity;
  }),
});

// 7. Balance check
const checkBalanceTool = tool({
  name: "check_balance",
  description: "Check if customer has enough balance to buy product.",
  parameters: checkBalanceSchema,
  execute: withToolLogging("check_balance", async ({ customerName, totalPrice }) => {
    const customer = customersDB.find((c) => c.name === customerName);
    return customer.balance >= totalPrice;
  }),
});
// 8. Create order
const createOrderTool = tool({
  name: "create_order",
  description: "Create an order with full customer profile and product info.",
  parameters: createOrderSchema,
  strict: true,
  execute: withToolLogging("create_order", async ({ order }) => {
    const normalizedOrder = orderPayloadSchema.parse(order);
    const orderId = "ORD" + (1000 + ordersDB.length + 1);
    const created = { orderId, ...normalizedOrder };
    ordersDB.push(created);
    return created;
  }),
});

//
// ─────────────────────────────────────────────
// MAIN AGENT DEFINITION
// ─────────────────────────────────────────────
//

const model = AI_MODEL.gpt_4o;
const client = OPENAI_DICT[model];

setDefaultOpenAIClient(client);
setOpenAIAPI('chat_completions');

const orderAgent = new Agent({
  name: "OrderCreationAgent",
  model: model,
  instructions: `
You are an advanced Order Creation Agent with full reasoning ability.
You must strictly follow this business logic:

────────────────────────────────────────
STEP 1 — Extract information (LLM only)
────────────────────────────────────────
From every user message, extract:
- customerName (if any)
- orderId (if any)
- productName (if any)
- quantity (if any)

Extraction is done internally. DO NOT call a tool for this.

────────────────────────────────────────
STEP 2 — Existing Order Flow
────────────────────────────────────────
If the user provides orderId:
  → Call get_order tool.
  → If NOT found:
      STOP and say:
      "Your provided order id is not existing in the system. Please try again or just need to enter the customer name."
  → If found:
      extract customerName from the order.

────────────────────────────────────────
STEP 3 — Customer Name Flow
────────────────────────────────────────
If user provides customerName:
  → Call get_customer tool.
  → If customer exists → continue order flow.
  → If customer does NOT exist:
      ask:
      "Please provide customer profile: name, dob, occupation, marital status, gender, address."

────────────────────────────────────────
STEP 4 — Product & Quantity
────────────────────────────────────────
Before you proceed:
  If productName missing → ask user.
  If quantity missing → ask user.

To validate product:
  → Call get_product
  → If NOT found:
      → Call get_all_products
      → Return the list and ask user to choose a valid product.

────────────────────────────────────────
STEP 5 — Stock Check
────────────────────────────────────────
Use check_stock tool.
If insufficient → tell the user and ask for a different quantity.

────────────────────────────────────────
STEP 6 — Balance Check
────────────────────────────────────────
Use check_balance tool.
If insufficient → STOP and tell user.

────────────────────────────────────────
STEP 7 — Create Order
────────────────────────────────────────
Use create_order tool and include:
- customer profile
- product name
- quantity
- price
- totalPrice

────────────────────────────────────────
STEP 8 — Final Response
────────────────────────────────────────
Return a clean, friendly order summary.

Always handle multi-turn, ask clarifying questions when needed, and remember conversation context.
  `,
  modelSettings: {
    temperature: 0,
    frequencyPenalty: 0,
    presencePenalty: 0,
    truncation: 'auto',
    // providerData: {
    //   cache: {
    //     "no-cache": true,
    //     "no-store": true
    //   }
    // }
  },
  tools: [
    getCustomerByNameTool,
    getOrderByIdTool,
    createCustomerTool,
    getProductTool,
    getAllProductsTool,
    checkStockTool,
    checkBalanceTool,
    createOrderTool,
  ],
});

//
// ─────────────────────────────────────────────
// RUN MULTI-TURN CONVERSATION
// ─────────────────────────────────────────────
//

// Basic CLI commands that users can trigger while chatting with the agent.
const SessionCommands = Object.freeze({
  exit: "/exit",
  history: "/history",
  reset: "/reset",
});

async function startInteractiveSession() {
  const messageHistory = [];
  let isProcessing = false;

  logger.logResponse("Order Creation Agent is ready. Type '/exit' to quit.", "system");
  logger.logResponse(
    "Share your order details (customer name, product, quantity). Use /history or /reset anytime.",
    "system"
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You> ",
  });

  rl.prompt();

  const handleAgentRun = async () => {

    const response = await withTrace('check_out_agent', () => run(orderAgent, messageHistory));

    messageHistory.push({ role: "assistant", content: response.finalOutput });
    logger.logResponse(response.finalOutput, "assistant");
  };

  const handleCommand = async (command) => {
    switch (command) {
      case SessionCommands.exit:
        logger.logResponse("Goodbye!", "system");
        rl.close();
        break;
      case SessionCommands.history:
        logger.debug("message history", JSON.stringify(messageHistory.slice(-10), null, 2));
        logger.logResponse("Printed last 10 turns to console.", "system");
        break;
      case SessionCommands.reset:
        messageHistory.length = 0;
        logger.logResponse("Conversation reset.", "system");
        break;
      default:
        logger.logResponse("Unknown command. Available: /exit, /history, /reset", "system");
        break;
    }
  };

  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }

    if (trimmed.startsWith("/")) {
      await handleCommand(trimmed);
      if (trimmed === SessionCommands.exit) {
        return;
      }
      rl.prompt();
      return;
    }

    if (isProcessing) {
      logger.logResponse("Agent is processing, please wait...", "system");
      return;
    }

    isProcessing = true;
    logger.logResponse(trimmed, "user");
    messageHistory.push({ role: "user", content: trimmed });

    try {
      await handleAgentRun();
    } catch (error) {
      logger.logResponse(`Agent error: ${error.message}`, "system");
      logger.debug("agent error", error);
    } finally {
      isProcessing = false;
      rl.prompt();
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

// startInteractiveSession();
