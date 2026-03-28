import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';

interface DangerZoneProps {
  openDeletionDialog: () => void;
}

const DangerZone = ({ openDeletionDialog }: DangerZoneProps) => {
  const { t } = useTranslation('user');

  return (
    <Column spacing={1.5}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="error.main"
        textTransform="uppercase"
        fontSize="0.7rem"
        letterSpacing={0.8}
      >
        {t('settingsModal.dangerZone')}
      </Typography>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'error.main',
          borderRadius: 2,
          p: 2,
        }}
      >
        <ResponsiveRow
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Column spacing={0.5}>
            <Typography variant="body2" fontWeight={600}>
              {t('settingsModal.deleteAccount')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('deleteDialog.description')}
            </Typography>
          </Column>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={openDeletionDialog}
            sx={{ flexShrink: 0, alignSelf: 'center' }}
          >
            {t('settingsModal.deleteAccount')}
          </Button>
        </ResponsiveRow>
      </Box>
    </Column>
  );
};

export default DangerZone;
