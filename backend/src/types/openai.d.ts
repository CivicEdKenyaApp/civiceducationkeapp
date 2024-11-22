declare module 'openai' {
  export interface ChatCompletionMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface ChatCompletion {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: ChatCompletionMessage;
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  export class OpenAI {
    constructor(config: { apiKey: string });
    
    chat: {
      completions: {
        create(params: {
          model: string;
          messages: ChatCompletionMessage[];
          max_tokens?: number;
          temperature?: number;
        }): Promise<ChatCompletion>;
      };
    };
  }
} 