import { tool } from '@openai/agents';
import { z } from 'zod';
import { productsDB } from './_mock-db.js';

export const getAllProductsTool = tool({
  name: 'get_all_products',
  description: 'Return the list of all available product names.',
  parameters: z.object({}).strict(),
  execute: async () => {
    return productsDB.map((p) => p.name);
  },
});
