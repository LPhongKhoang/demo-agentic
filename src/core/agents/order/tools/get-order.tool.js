import { tool } from '@openai/agents';
import { z } from 'zod';
import { ordersDB } from './_mock-db.js';

export const getOrderTool = tool({
  name: 'get_order',
  description: 'Return an order by its order ID.',
  parameters: z.object({
    orderId: z.string().min(1),
  }),
  execute: async ({ orderId }) => {
    return ordersDB.find((o) => o.orderId === orderId) ?? null;
  },
});
