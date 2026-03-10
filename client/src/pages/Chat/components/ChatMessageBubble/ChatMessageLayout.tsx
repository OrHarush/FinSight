import { ReactNode } from 'react';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { useMediaQuery, useTheme } from '@mui/material';

interface ChatMessageLayoutProps {
  avatar: ReactNode;
  messageBubble: ReactNode;
  modelBadge: ReactNode;
  isUser: boolean;
}

const ChatMessageLayout = ({
  avatar,
  messageBubble,
  modelBadge,
  isUser,
}: ChatMessageLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Column alignItems="flex-start" spacing={0.5}>
        {avatar}
        <Column alignItems="flex-start" spacing={0.5}>
          {messageBubble}
          {modelBadge}
        </Column>
      </Column>
    );
  }

  return (
    <Row justifyContent={isUser ? 'flex-end' : 'flex-start'} alignItems="flex-start" spacing={1}>
      {!isUser && avatar}
      <Column alignItems={isUser ? 'flex-end' : 'flex-start'} spacing={0.5} width={'100%'}>
        {messageBubble}
        {modelBadge}
      </Column>
      {isUser && avatar}
    </Row>
  );
};

export default ChatMessageLayout;
