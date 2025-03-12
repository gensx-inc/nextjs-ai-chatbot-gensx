<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Next.js AI Chatbot with GenSX</h1>
</a>

<p align="center">
  An Open-Source AI Chatbot Template Built With Next.js, GenSX and the AI SDK by Vercel.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#gensx-support"><strong>GenSX Support</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- [GenSX Support](#https://gensx.com)
  - Definition of workflows and tools using GenSX
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication

## Model Providers

This template ships with OpenAI `gpt-4o` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## GenSX Support

This updated version includes support for GenSX workflows. 

TLDR; To add a new tool to your chat application:

1. Create a workflow in `lib/workflows/`
2. Create a tool that uses the workflow in `lib/ai/tools/`
3. Import and add the tool to both the `experimental_activeTools` array and the `tools` object in `execute-chat.tsx`

### Creating Workflows

1. Create a new workflow file in the `lib/workflows` directory:

```tsx
// Example: lib/workflows/calculator.tsx
/** @jsxImportSource @gensx/core */
import { Component, Workflow } from "@gensx/core"
import * as gensx from "@gensx/core"
import { GenerateText } from "@gensx/vercel-ai-sdk"
import { openai } from "@ai-sdk/openai"

interface CalculatorProps {
    expression: string
}

interface CalculatorResult {
    result: number
}

const Calculator = Component<CalculatorProps, CalculatorResult>('calculator', 
    async (props) => {
        const languageModel = openai("gpt-4o-mini");
        return {
            result: <GenerateText
                prompt={`Calculate the result of the following expression: ${props.expression}`}
                model={languageModel}
            >
                {result => {
                    return result.text
                }}
            </GenerateText>
        }
    }
)
const CalculatorWorkflow = Workflow('Calculator Tool', Calculator)

export default CalculatorWorkflow;
```

### Creating Tools from Workflows

Once you've created a workflow, you can convert it into a tool that can be used in the chat application:

```typescript
// Example: lib/ai/tools/calculator.ts
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
```

### Integrating Tools into the Chat Workflow

The main chat execution workflow integrates all your tools. Here's how to add your new tool to the chat system:

```tsx
// In lib/workflows/execute-chat.tsx
/** @jsxImportSource @gensx/core */
import { Component, Workflow } from "@gensx/core"
import { StreamText } from '@gensx/vercel-ai-sdk'
import { calculator } from '../ai/tools/calculator'
// ... other imports ...

interface ExecuteChatProps {
  session: Session,
  messages: Array<Message>,
  saveMessages: ({ messages }: { messages: Array<DBMessage> }) => Promise<any>,
  id: string, 
  selectedChatModel: string,
  dataStream: DataStreamWriter,
}

const ExecuteChat = Component<ExecuteChatProps, any>(
  'ExecuteChat', 
  (props) => {
    const { session, messages, saveMessages, id, selectedChatModel, dataStream } = props;
    
    return <StreamText
            model={myProvider.languageModel(selectedChatModel)}
            system={systemPrompt({ selectedChatModel })}
            messages={messages}
            maxSteps={5}
            experimental_activeTools={
              selectedChatModel === 'chat-model-reasoning'
                ? []
                : [
                    'getWeather',
                    'createDocument',
                    'updateDocument',
                    'requestSuggestions',
                    'calculator', // Add your new tool here
                  ]
            }
            tools={{
              getWeather,
              createDocument: createDocument({ session, dataStream }),
              updateDocument: updateDocument({ session, dataStream }),
              requestSuggestions: requestSuggestions({
                session,
                dataStream,
              }),
              calculator, // Register your tool here
            }}
            // ... other props ...
          />;
  }
);

const ExecuteChatWorkflow = Workflow("ExecuteChatWorkflow", ExecuteChat);

export default ExecuteChatWorkflow;
```

For more advanced usage and configuration options, refer to the (GenSX documentation)[gensx.com/docs].



## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`
4. Navigate to app.gensx.com to generate an API key and get your org name to put into the env vars

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).
