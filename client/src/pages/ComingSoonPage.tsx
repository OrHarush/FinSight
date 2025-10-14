import { Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import logo from '@/assets/finSightIcon.png';
import { useTranslation } from 'react-i18next';

const ComingSoonPage = () => {
  const { t } = useTranslation('common');

  return (
    <Column
      alignItems="center"
      justifyContent="center"
      spacing={4}
      sx={{
        minHeight: '100%',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <img
        src={logo}
        alt="FinSight Logo"
        width={120}
        height={120}
        style={{ borderRadius: '12px' }}
      />

      <Typography variant="h3" fontWeight={600}>
        {t('comingSoon.title')}
      </Typography>
      <Typography variant="subtitle1" sx={{ maxWidth: 400 }}>
        {t('comingSoon.subtitle')}
      </Typography>
    </Column>
  );
};

export default ComingSoonPage;
