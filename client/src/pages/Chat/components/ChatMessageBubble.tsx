import { ChatMessage } from '@/types/Chat';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { Paper, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useAuth } from '@/providers/AuthProvider';
import ReactMarkdown from 'react-markdown';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isUser = message.role === 'user';

  const avatar = isUser ? (
    <Avatar
      src={user?.picture}
      alt={user?.name}
      sx={{
        width: isMobile ? 32 : 40,
        height: isMobile ? 32 : 40,
        border: '2px solid #9c88ff',
        flexShrink: 0,
      }}
    />
  ) : (
    <Avatar
      sx={{
        bgcolor: 'primary.main',
        width: isMobile ? 32 : 40,
        height: isMobile ? 32 : 40,
        flexShrink: 0,
      }}
    >
      <SmartToyIcon sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }} />
    </Avatar>
  );

  const messageBubble = (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1.5,
        maxWidth: isMobile ? '100%' : '75%',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ children }) => (
            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
              {children}
            </Typography>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          strong: ({ children }) => <strong>{children}</strong>,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          em: ({ children }) => <em>{children}</em>,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ul: ({ children }) => (
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ol: ({ children }) => (
            <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h1: ({ children }) => (
            <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
              {children}
            </Typography>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h2: ({ children }) => (
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5 }}>
              {children}
            </Typography>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '0.9em',
              }}
            >
              {children}
            </code>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </Paper>
  );

  // On mobile: message above icon for user, icon above message for AI
  // On desktop: avatar beside message
  if (isMobile) {
    if (isUser) {
      return (
        <Column alignItems="flex-end" spacing={0.75}>
          {avatar}
          {messageBubble}
        </Column>
      );
    }

    return (
      <Column alignItems="flex-start" spacing={0.75}>
        {avatar}
        {messageBubble}
      </Column>
    );
  }

  // Desktop layout: horizontal
  return (
    <Row justifyContent={isUser ? 'flex-end' : 'flex-start'} alignItems="flex-start" spacing={1}>
      {!isUser && avatar}
      {messageBubble}
      {isUser && avatar}
    </Row>
  );
};

export default ChatMessageBubble;
