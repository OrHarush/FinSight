import { useTranslation } from 'react-i18next';
import Column from '@/components/layout/Containers/Column';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Typography } from '@mui/material';

const AllOnTrackState = () => {
  const { t } = useTranslation('overview');

  return (
    <Column
      height={'80%'}
      alignItems="center"
      justifyContent="center"
      sx={{ py: 6, opacity: 0.85 }}
      spacing={1}
    >
      <CheckCircleOutlineIcon
        sx={{
          fontSize: 40,
          color: 'success.main',
          mb: 0.5,
        }}
      />
      <Typography fontWeight={600}>{t('budgetWatch.allOnTrack')}</Typography>
    </Column>
  );
};

export default AllOnTrackState;
