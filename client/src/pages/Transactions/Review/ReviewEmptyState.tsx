import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const ReviewEmptyState = () => {
  const { t } = useTranslation('transactions');

  return (
    <Column spacing={1.5} alignItems="center" justifyContent="center" sx={{ py: 8 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.selected',
        }}
      >
        <TaskAltIcon sx={{ fontSize: 32, color: 'success.main' }} />
      </Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {t('review.empty.title')}
      </Typography>
    </Column>
  );
};

export default ReviewEmptyState;
