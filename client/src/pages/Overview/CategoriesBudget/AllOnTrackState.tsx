import { useTranslation } from 'react-i18next';
import Column from '@/components/layout/Containers/Column';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Typography } from '@mui/material';

const AllOnTrackState = () => {
  const { t } = useTranslation('overview');

  return (
    <Column
      height={'100%'}
      alignItems="center"
      justifyContent="center"
      sx={{ opacity: 0.85 }}
      spacing={1}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'success.main' }} />
      <Typography fontWeight={700}>{t('budgetWatch.allOnTrack')}</Typography>
      <Typography>{t('budgetWatch.addBudgetHint')}</Typography>
    </Column>
  );
};

export default AllOnTrackState;
