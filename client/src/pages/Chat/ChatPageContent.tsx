import { ChatMessage } from '@/types/Chat';
import ChatEmpty from '@/pages/Chat/components/ChatEmpty';
import ChatMessageList from '@/pages/Chat/components/ChatMessageList';

interface ChatPageContentProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatPageContent = ({ messages, isLoading }: ChatPageContentProps) => {
  if (messages.length === 0) {
    return <ChatEmpty />;
  }

  return <ChatMessageList messages={messages} isLoading={isLoading} />;
};

export default ChatPageContent;
