import { useState } from 'react';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ChatHeader from '@/pages/Chat/components/ChatHeader';
import ChatMessageList from '@/pages/Chat/components/ChatMessageList';
import ChatInput from '@/pages/Chat/components/ChatInput';
import ChatEmpty from '@/pages/Chat/components/ChatEmpty';
import { ChatMessage } from '@/types/Chat';
import Column from '@/components/shared/layout/containers/Column';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';

const Chat = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-11

      const response = await api.post(API_ROUTES.CHAT, {
        message: content,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        currentDate,
        currentYear,
        currentMonth,
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.data,
        createdAt: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      const errorResponse = (error as Record<string, unknown>).response as
        | Record<string, unknown>
        | undefined;
      const errorMsg = (errorResponse?.data as Record<string, unknown>)?.error as string;

      const errorChatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg || 'Failed to get response from AI'}`,
        createdAt: new Date(),
      };

      addMessage(errorChatMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const chatContent = (
    <>
      <ChatHeader />
      <Column flex={1} overflow="hidden">
        {messages.length === 0 ? <ChatEmpty /> : <ChatMessageList messages={messages} />}
      </Column>
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </>
  );

  const paperContent = (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {chatContent}
    </Paper>
  );

  if (isDesktop) {
    return <PageLayout>{paperContent}</PageLayout>;
  }

  return (
    <Column height="100%" width="100%" padding={1} spacing={0}>
      {paperContent}
    </Column>
  );
};

export default Chat;
