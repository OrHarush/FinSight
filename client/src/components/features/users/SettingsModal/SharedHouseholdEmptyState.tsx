import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

interface SharedHouseholdEmptyStateProps {
  openCreateDialog: () => void;
}

const SharedHouseholdEmptyState = ({ openCreateDialog }: SharedHouseholdEmptyStateProps) => {
  const { t } = useTranslation('user');

  return (
    <Column
      spacing={2.5}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{ flex: 1, minHeight: 380, py: 3, px: 1 }}
    >
      <HomeWorkOutlinedIcon
        sx={{ fontSize: '3.5rem', color: 'primary.main', opacity: 0.85 }}
      />
      <Column spacing={1}>
        <Typography variant="h6" fontWeight={600}>
          {t('sharedHousehold.empty.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
          {t('sharedHousehold.empty.body')}
        </Typography>
      </Column>
      <Button variant="contained" onClick={openCreateDialog} sx={{ minWidth: 200 }}>
        {t('sharedHousehold.empty.createButton')}
      </Button>
    </Column>
  );
};

export default SharedHouseholdEmptyState;
