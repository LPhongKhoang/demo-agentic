import { tool } from '@openai/agents';
import { z } from 'zod';
import { productsDB } from './_mock-db.js';

export const checkStockTool = tool({
  name: 'check_stock',
  description: 'Check if a product has enough stock for the requested quantity.',
  parameters: z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
  execute: async ({ name, quantity }) => {
    const product = productsDB.find((p) => p.name === name);
    return !!(product && product.stock >= quantity);
  },
});
