import { tool } from '@openai/agents';
import { z } from 'zod';
import { ordersDB } from './_mock-db.js';

export const createOrderTool = tool({
  name: 'create_order',
  description: 'Create a new order for a customer after all validations pass.',
  parameters: z.object({
    order: z.object({
      customerName: z.string().min(1),
      productName: z.string().min(1),
      quantity: z.number().int().positive(),
      price: z.number().nonnegative(),
      totalPrice: z.number().nonnegative(),
    }).strict(),
  }).strict(),
  execute: async ({ order }) => {
    const orderId = 'ORD' + (1000 + ordersDB.length + 1);
    const created = { orderId, ...order };
    ordersDB.push(created);
    return created;
  },
});
