/** @jsxImportSource @gensx/core */

import {
  type Message,
  smoothStream,
  DataStreamWriter
} from 'ai';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  generateUUID,
  sanitizeResponseMessages,
} from '@/lib/utils';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import * as gensx from '@gensx/core';
import { StreamText } from '@gensx/vercel-ai-sdk';
import { type Message as DBMessage } from '@/lib/db/schema';
import { Session } from 'next-auth';

interface StreamTextParams {
  session: Session,
  messages: Array<Message>,
  saveMessages: ({ messages }: { messages: Array<DBMessage> }) => Promise<any>,
  id: string, 
  selectedChatModel: string,
  dataStream: DataStreamWriter
}

const ExecuteChatComponent = gensx.Component<StreamTextParams, any>('ExecuteChatComponent', (props) => {
  const { session, messages, saveMessages, id, selectedChatModel, dataStream } = props;
  return (
    <StreamText
      model={myProvider.languageModel(selectedChatModel)}
      system={systemPrompt({ selectedChatModel })}
      messages={messages}
      maxSteps={5}
      experimental_activeTools={ selectedChatModel === 'chat-model-reasoning' ? [] : [
        'getWeather',
        'createDocument',
        'updateDocument',
        'requestSuggestions',
      ]}
      experimental_transform={smoothStream({ chunking: 'word' })}
      experimental_generateMessageId={generateUUID}
      tools={{
        getWeather,
        createDocument: createDocument({ session, dataStream }),
        updateDocument: updateDocument({ session, dataStream }),
        requestSuggestions: requestSuggestions({
          session,
          dataStream,
        })
      }}
      onFinish={async ({ response, reasoning }) => {
        if (session.user?.id) {
          try {
            const sanitizedResponseMessages = sanitizeResponseMessages({
              messages: response.messages,
              reasoning,
            });

            await saveMessages({
              messages: sanitizedResponseMessages.map((message) => {
                return {
                  id: message.id,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                };
              }),
            });
          } catch (error) {
            console.error('Failed to save chat');
          }
        }
      }}
      experimental_telemetry={{
        isEnabled: isProductionEnvironment,
        functionId: 'stream-text',
      }}
    />
  );
});

const ExecuteChatWorkflow = gensx.Workflow("ExecuteChatWorkflow", ExecuteChatComponent);
export default ExecuteChatWorkflow;