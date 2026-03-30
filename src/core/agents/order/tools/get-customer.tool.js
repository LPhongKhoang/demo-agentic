import { tool } from '@openai/agents';
import { z } from 'zod';
import { customersDB } from './_mock-db.js';

export const getCustomerTool = tool({
  name: 'get_customer',
  description: 'Find a customer by name in the database.',
  parameters: z.object({
    name: z.string().min(1),
  }),
  execute: async ({ name }) => {
    return customersDB.find((c) => c.name.toLowerCase() === name.toLowerCase()) ?? null;
  },
});
