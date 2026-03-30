import { tool } from '@openai/agents';
import { z } from 'zod';

const styleMultiplier = {
  budget: 0.85,
  standard: 1,
  premium: 1.45,
};

const dailyThemes = [
  'arrival-and-orientation',
  'city-highlights',
  'local-food-and-culture',
  'nature-or-day-trip',
  'shopping-and-hidden-gems',
  'flex-or-rest-day',
];

export const planTripItineraryTool = tool({
  name: 'plan-trip-itinerary',
  description: 'Create a practical day-by-day trip plan for a destination.',
  parameters: z.object({
    destination: z.string().min(2),
    startDate: z.string().optional(),
    totalDays: z.number().int().min(1).max(30),
    travelers: z.number().int().min(1).max(12).default(1),
    travelStyle: z.enum(['budget', 'standard', 'premium']).default('standard'),
    interests: z.array(z.string()).min(1).max(8).default(['culture', 'food']),
  }),
  execute: async (input) => {
    const {
      destination,
      startDate,
      totalDays,
      travelers,
      travelStyle,
      interests,
    } = input;

    const itinerary = Array.from({ length: totalDays }, (_, idx) => {
      const dayNumber = idx + 1;
      const theme = dailyThemes[idx % dailyThemes.length];
      const primaryInterest = interests[idx % interests.length];

      return {
        day: dayNumber,
        theme,
        morning: `Explore ${primaryInterest} spots in central ${destination}.`,
        afternoon: `Visit one signature attraction and one neighborhood walk in ${destination}.`,
        evening: 'Enjoy local dinner, then keep 60-90 minutes for flexible activities.',
        estimatedDailyHours: 8,
      };
    });

    const baseDailySpendPerPerson = 75;
    const recommendedDailyBudget = Math.round(
      baseDailySpendPerPerson * styleMultiplier[travelStyle]
    );

    return {
      destination,
      startDate: startDate || 'flexible',
      travelers,
      travelStyle,
      interests,
      summary: `${totalDays}D/${totalDays - 1}N plan for ${destination}.`,
      recommendedDailyBudgetPerPersonUSD: recommendedDailyBudget,
      itinerary,
      notes: [
        'Keep at least one flexible slot each day for weather or transit changes.',
        'Book high-demand attractions 2-4 weeks in advance when possible.',
      ],
    };
  },
});
