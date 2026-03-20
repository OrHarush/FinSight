import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Avatar, Box, keyframes,Paper } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const dotPulse = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const ChatLoadingSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const avatar = (
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

  const skeletonBubble = (
    <Paper
      elevation={0}
      sx={{
        px: 2,
        py: 1.5,
        maxWidth: isMobile ? '100%' : '75%',
        borderRadius: '16px 16px 16px 4px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Row spacing={0.5} sx={{ mt: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'grey.400',
            animation: `${dotPulse} 1.2s infinite`,
            animationDelay: '0s',
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'grey.400',
            animation: `${dotPulse} 1.2s infinite`,
            animationDelay: '0.2s',
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'grey.400',
            animation: `${dotPulse} 1.2s infinite`,
            animationDelay: '0.4s',
          }}
        />
      </Row>
    </Paper>
  );

  if (isMobile) {
    return (
      <Column alignItems="flex-start" spacing={0.75}>
        {avatar}
        {skeletonBubble}
      </Column>
    );
  }

  return (
    <Row justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      {avatar}
      {skeletonBubble}
    </Row>
  );
};

export default ChatLoadingSkeleton;
