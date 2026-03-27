import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';

const NoDataVariant = () => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={2} height="100%" justifyContent="center">
      <Column spacing={0.25}>
        <Typography variant="h5" color="text.disabled">
          {t('noData.title')}
        </Typography>
      </Column>
      <Divider />
      <Column alignItems="center" spacing={1.5} py={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '2px dashed',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
          }}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {t('noData.detail')}
        </Typography>
      </Column>
    </Column>
  );
};

export default NoDataVariant;
