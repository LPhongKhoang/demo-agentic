import { tool } from '@openai/agents';
import { z } from 'zod';
import { productsDB } from './_mock-db.js';

export const getProductTool = tool({
  name: 'get_product',
  description: 'Return product details by product name.',
  parameters: z.object({
    name: z.string().min(1),
  }),
  execute: async ({ name }) => {
    return productsDB.find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null;
  },
});
