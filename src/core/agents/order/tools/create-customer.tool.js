import { tool } from '@openai/agents';
import { z } from 'zod';
import { customersDB } from './_mock-db.js';

export const createCustomerTool = tool({
  name: 'create_customer',
  description: 'Create a new customer profile in the database.',
  parameters: z.object({
    name: z.string().min(1),
    dob: z.string().min(1),
    occupation: z.string().min(1),
    maritalStatus: z.string().min(1),
    gender: z.string().min(1),
    address: z.string().min(1),
    balance: z.number().nonnegative().default(0),
  }).strict(),
  execute: async (profile) => {
    customersDB.push(profile);
    return profile;
  },
});
