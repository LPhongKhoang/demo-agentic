import { tool } from '@openai/agents';
import { z } from 'zod';
import { customersDB } from './_mock-db.js';

export const checkBalanceTool = tool({
  name: 'check_balance',
  description: 'Check if a customer has sufficient balance to cover the total price.',
  parameters: z.object({
    customerName: z.string().min(1),
    totalPrice: z.number().nonnegative(),
  }),
  execute: async ({ customerName, totalPrice }) => {
    const customer = customersDB.find((c) => c.name === customerName);
    if (!customer) {
      return false;
    }
    return customer.balance >= totalPrice;
  },
});
