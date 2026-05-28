import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

const SwipeToDeleteHint = () => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  return (
    <Row
      spacing={0.5}
      alignItems="center"
      justifyContent={isXs ? 'center' : 'flex-start'}
      sx={{ width: '100%', color: 'text.secondary', opacity: 0.7 }}
    >
      <InfoOutlinedIcon sx={{ fontSize: '0.75rem' }} />
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {t('swipeToDeleteHint')}
      </Typography>
    </Row>
  );
};

export default SwipeToDeleteHint;
