// 
import { tool } from 'ai';
import { z } from 'zod';
import CalculatorWorkflow from '@/lib/workflows/calculator';
export const calculator = 
  tool({
    description: 'Perform mathematical calculations',
    parameters: z.object({
      expression: z.string(),
    }),
    execute: async (params) => {
      try {
        return CalculatorWorkflow.run(params);
      } catch (error) {
        console.error('Error performing calculation:', error);
        return { result: 'Error performing calculation' };
      }
    },
  }); 