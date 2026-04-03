import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import Row from '@/components/shared/layout/containers/Row';

interface DeleteTransactionDialogProps extends BaseDialogProps {
  confirmDeletion: () => void;
}

const DeleteTransactionDialog = ({
  isOpen,
  closeDialog,
  confirmDeletion,
}: DeleteTransactionDialogProps) => {
  const { t } = useTranslation('transactions');

  const confirmAndClose = () => {
    confirmDeletion();
    closeDialog();
  };

  return (
    <FinSightDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('actions.delete')}
      titleIcon={WarningAmberRoundedIcon}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <DialogContent>
        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
          {t('deleteDialog.body')}
        </Typography>
        <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.95em' }}>
          {t('deleteDialog.irreversible')}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Row spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button onClick={closeDialog} variant="outlined" sx={{ minWidth: 90 }}>
            {t('common:buttons.cancel')}
          </Button>
          <Button onClick={confirmAndClose} color="error" variant="contained" sx={{ minWidth: 90 }}>
            {t('common:deleteDialog.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </FinSightDialog>
  );
};

export default DeleteTransactionDialog;
