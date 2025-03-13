import { tool } from 'ai';
import { z } from 'zod';
import GetDateWorkflow from '@/lib/workflows/date';
export const getDate = 
  tool({
    description: 'Get the current date and time',
    parameters: z.object({}),
    execute: async (params) => {
      try {
        return GetDateWorkflow.run(params);
      } catch (error) {
        console.error('Error performing date:', error);
        return { result: 'Error performing date' };
      }
    },
  });   