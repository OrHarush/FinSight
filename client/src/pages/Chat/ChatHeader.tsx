import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Avatar, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

const ChatHeader = () => {
  const { t } = useTranslation('chat');

  return (
    <Row
      alignItems="center"
      spacing={1.5}
      padding={2}
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
        <SmartToyIcon sx={{ fontSize: '1.2rem' }} />
      </Avatar>
      <Typography variant="h6" fontWeight={600}>
        {t('header.title')}
      </Typography>
    </Row>
  );
};

export default ChatHeader;
