import Column from '@/components/shared/layout/containers/Column';
import { Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ChatEmpty = () => (
  <Column flex={1} alignItems="center" justifyContent="center" spacing={2} padding={4}>
    <SmartToyIcon sx={{ fontSize: '3rem', color: 'text.disabled' }} />
    <Typography variant="h6" color="text.secondary" textAlign="center">
      Ask me anything about your finances
    </Typography>
    <Typography variant="body2" color="text.disabled" textAlign="center">
      I can analyze your transactions, budgets, accounts and more.
    </Typography>
  </Column>
);

export default ChatEmpty;
