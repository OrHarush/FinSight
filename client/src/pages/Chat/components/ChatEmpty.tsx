import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const ChatEmpty = () => {
  const { t } = useTranslation('chat');

  return (
    <Column flex={1} alignItems="center" justifyContent="center" spacing={2} padding={4}>
      <SmartToyIcon sx={{ fontSize: '3rem', color: 'text.disabled' }} />
      <Typography variant="h6" color="text.secondary" textAlign="center">
        {t('empty.title')}
      </Typography>
      <Typography variant="body2" color="text.disabled" textAlign="center">
        {t('empty.description')}
      </Typography>
    </Column>
  );
};

export default ChatEmpty;
