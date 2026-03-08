import { useState, KeyboardEvent } from 'react';
import Row from '@/components/shared/layout/containers/Row';
import { IconButton, TextField, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [value, setValue] = useState('');

  const submitMessage = () => {
    const trimmed = value.trim();

    if (!trimmed || isLoading) {
      return;
    }

    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
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
        maxRows={4}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your finances..."
        disabled={isLoading}
        size="small"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
      />
      <IconButton
        color="primary"
        onClick={submitMessage}
        disabled={!value.trim() || isLoading}
        sx={{ mb: 0.5 }}
      >
        {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
      </IconButton>
    </Row>
  );
};

export default ChatInput;
