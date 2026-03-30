import { tool } from '@openai/agents';
import { z } from 'zod';

const styleMultiplier = {
  budget: 0.75,
  standard: 1,
  premium: 1.6,
};

const dailyCostByCategory = {
  accommodation: 60,
  food: 28,
  localTransport: 12,
  activities: 25,
};

export const estimateTripBudgetTool = tool({
  name: 'estimate-trip-budget',
  description: 'Estimate total travel budget with category breakdown and contingency.',
  parameters: z.object({
    destination: z.string().min(2),
    totalDays: z.number().int().min(1).max(30),
    travelers: z.number().int().min(1).max(12),
    travelStyle: z.enum(['budget', 'standard', 'premium']).default('standard'),
    includeFlights: z.boolean().default(true),
    roundTripFlightPerPersonUSD: z.number().min(0).max(5000).default(350),
    contingencyPercent: z.number().min(0).max(30).default(10),
  }),
  execute: async (input) => {
    const {
      destination,
      totalDays,
      travelers,
      travelStyle,
      includeFlights,
      roundTripFlightPerPersonUSD,
      contingencyPercent,
    } = input;

    const multiplier = styleMultiplier[travelStyle];
    const perPerson = Object.fromEntries(
      Object.entries(dailyCostByCategory).map(([category, dailyCost]) => {
        const amount = Math.round(dailyCost * totalDays * multiplier);
        return [category, amount];
      })
    );

    const subtotalWithoutFlightsPerPerson = Object.values(perPerson).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const flightsPerPerson = includeFlights ? roundTripFlightPerPersonUSD : 0;
    const subtotalPerPerson = subtotalWithoutFlightsPerPerson + flightsPerPerson;
    const contingencyPerPerson = Math.round(
      subtotalPerPerson * (contingencyPercent / 100)
    );
    const totalPerPerson = subtotalPerPerson + contingencyPerPerson;
    const grandTotal = totalPerPerson * travelers;

    return {
      destination,
      assumptions: {
        totalDays,
        travelers,
        travelStyle,
        includeFlights,
        contingencyPercent,
      },
      breakdownPerPersonUSD: {
        ...perPerson,
        flights: flightsPerPerson,
        contingency: contingencyPerPerson,
      },
      subtotalPerPersonUSD: subtotalPerPerson,
      totalPerPersonUSD: totalPerPerson,
      grandTotalUSD: grandTotal,
      budgetRangesUSD: {
        conservative: Math.round(grandTotal * 0.9),
        realistic: grandTotal,
        comfortable: Math.round(grandTotal * 1.15),
      },
    };
  },
});
