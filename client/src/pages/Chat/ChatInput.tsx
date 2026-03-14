import { useState, KeyboardEvent } from 'react';
import Row from '@/components/shared/layout/containers/Row';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChatMessage } from '@/types/Chat';
import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  messages: ChatMessage[];
  onAddMessage: (message: ChatMessage) => void;
  onSetLoading: (loading: boolean) => void;
}

const ChatInput = ({ messages, onAddMessage, onSetLoading }: ChatInputProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('chat');
  const [value, setValue] = useState('');

  const sendMessage = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date(),
    };

    onAddMessage(userMessage);
    setValue('');
    onSetLoading(true);

    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const response = await api.post(API_ROUTES.CHAT, {
        message: trimmed,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        currentDate,
        currentYear,
        currentMonth,
      });

      const { message: responseText, model, parsed } = response.data.data;

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        model,
        parsed,
        createdAt: new Date(),
      };

      onAddMessage(assistantMessage);
    } catch (error) {
      const errorResponse = (error as Record<string, unknown>).response as
        | Record<string, unknown>
        | undefined;
      const errorMsg = (errorResponse?.data as Record<string, unknown>)?.error as string;

      const fallbackErrorMessage = t('errors.fallback');
      const finalErrorMessage = errorMsg || fallbackErrorMessage;

      const errorChatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: t('errors.prefix', { message: finalErrorMessage }),
        createdAt: new Date(),
      };

      onAddMessage(errorChatMessage);
    } finally {
      onSetLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Row
      spacing={1}
      padding={2}
      alignItems="flex-end"
      sx={{ borderTop: '1px solid', borderColor: 'divider' }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={isMobile ? 4 : 7}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('input.placeholder')}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            height: '100%',
            maxHeight: isMobile ? '160px' : '280px',
          },
          overflow: 'hidden',
        }}
      />
      <IconButton
        color="primary"
        onClick={sendMessage}
        disabled={!value.trim()}
        sx={{ mb: 0.5, flexShrink: 0 }}
      >
        <SendIcon />
      </IconButton>
    </Row>
  );
};

export default ChatInput;
