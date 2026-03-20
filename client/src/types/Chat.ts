import { AccountDto } from '@/types/Account';
import { CategoryDto } from '@/types/Category';

export type MessageRole = 'user' | 'assistant';

export type ParsedChatResponse =
  | { type: 'categories'; text: string; categories: CategoryDto[] }
  | { type: 'accounts'; text: string; accounts: AccountDto[] }
  | { type: 'text'; text: string };

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  model?: string;
  parsed?: ParsedChatResponse;
}
