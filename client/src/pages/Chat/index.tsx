import { useState } from 'react';
import { Paper, useMediaQuery, useTheme } from '@mui/material';
import PageLayout from '@/components/shared/layout/page/PageLayout';
import ChatHeader from '@/pages/Chat/ChatHeader';
import ChatInput from '@/pages/Chat/ChatInput';
import { ChatMessage } from '@/types/Chat';
import Column from '@/components/shared/layout/containers/Column';
import ChatPageContent from './ChatPageContent';

const Chat = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const chatContent = (
    <>
      <ChatHeader />
      <ChatPageContent messages={messages} isLoading={isLoading} />
      <ChatInput messages={messages} onAddMessage={addMessage} onSetLoading={setIsLoading} />
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
