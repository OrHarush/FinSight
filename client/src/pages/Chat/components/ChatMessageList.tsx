import { ChatMessage } from '@/types/Chat';
import ChatMessageBubble from '@/pages/Chat/components/ChatMessageBubble';
import ChatLoadingSkeleton from '@/pages/Chat/components/ChatLoadingSkeleton';
import { useEffect, useRef } from 'react';
import ScrollableColumn from '@/components/shared/layout/containers/ScrollableColumn';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

const ChatMessageList = ({ messages, isLoading = false }: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollableColumn flex={1} spacing={2} sx={{ p: 3 }}>
      {messages.map(message => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <ChatLoadingSkeleton />}
      <div ref={bottomRef} />
    </ScrollableColumn>
  );
};

export default ChatMessageList;
