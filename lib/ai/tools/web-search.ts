import { tool } from 'ai';
import { z } from 'zod';
import WebSearchWorkflow from '@/lib/workflows/web-search';
export const webSearch = 
  tool({
    description: 'Search the web for AI companies',
    parameters: z.object({
      usersOriginalQuery: z.string(),
      searchQuery: z.string(),
      date: z.string(),
      numberOfResults: z.number(),
    }),
    execute: async (params) => {
      try {
        return WebSearchWorkflow.run(params);
      } catch (error) {
        console.error('Error performing web search:', error);
        return { result: 'Error performing web search' };
      }
    },
  });   