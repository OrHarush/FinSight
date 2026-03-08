import { ChatMessage } from '@/types/Chat';
import Column from '@/components/shared/layout/containers/Column';
import ChatMessageBubble from '@/pages/Chat/components/ChatMessageBubble';
import { useEffect, useRef } from 'react';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Column flex={1} overflow="auto" spacing={2} padding={2}>
      {messages.map(message => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </Column>
  );
};

export default ChatMessageList;
