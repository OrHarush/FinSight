import { ChatMessage } from '@/types/Chat';
import { Paper, Typography, Avatar, useTheme, useMediaQuery } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useAuth } from '@/providers/AuthProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatCategoryPills from '@/pages/Chat/components/ChatMessageBubble/ChatCategoryPills';
import ChatAccountCards from '@/pages/Chat/components/ChatMessageBubble/ChatAccountCards';
import ModelBadge from '@/pages/Chat/components/ChatMessageBubble/ModelBadge';
import ChatMessageLayout from '@/pages/Chat/components/ChatMessageBubble/ChatMessageLayout';

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
        width: '100%',
        maxWidth: isMobile ? '100%' : '60%',
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        backgroundColor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                fontWeight: '500',
              }}
            >
              {children}
            </Typography>
          ),
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          ul: ({ children }) => (
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ol>
          ),
          li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
          h1: ({ children }) => (
            <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5 }}>
              {children}
            </Typography>
          ),
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
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '8px 0' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95rem' }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                border: '1px solid rgba(128,128,128,0.4)',
                padding: '6px 10px',
                textAlign: 'left',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(0,0,0,0.12)',
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                border: '1px solid rgba(128,128,128,0.2)',
                padding: '5px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
      {!isUser && message.parsed?.type === 'categories' && (
        <ChatCategoryPills categories={message.parsed.categories} />
      )}
      {!isUser && message.parsed?.type === 'accounts' && (
        <ChatAccountCards accounts={message.parsed.accounts} />
      )}
    </Paper>
  );

  const modelBadge = !isUser && message.model && <ModelBadge model={message.model} />;

  return (
    <ChatMessageLayout
      avatar={avatar}
      messageBubble={messageBubble}
      modelBadge={modelBadge}
      isUser={isUser}
    />
  );
};

export default ChatMessageBubble;
