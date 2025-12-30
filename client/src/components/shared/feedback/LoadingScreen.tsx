import { CircularProgress, Typography } from '@mui/material';
import finSightIcon from '@/assets/finSightIcon.png';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
  const { t } = useTranslation('common');

  return (
    <Column justifyContent="center" alignItems="center" height="100%" justifySelf={'center'}>
      <img src={finSightIcon} alt="FinSight Logo" width={180} height={180} />
      <Typography variant="h6" mt={2}>
        {t('loading')}
      </Typography>
      <CircularProgress sx={{ mt: 3, color: 'primary.main' }} />
    </Column>
  );
};

export default LoadingScreen;
