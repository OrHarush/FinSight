import { useState } from 'react';
import { DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';

interface UserDeletionDialogProps extends BaseDialogProps {
  onConfirm: () => void;
}

const UserDeletionDialog = ({ isOpen, closeDialog, onConfirm }: UserDeletionDialogProps) => {
  const { t } = useTranslation('user');
  const confirmKeyword = t('deleteDialog.confirmKeyword');
  const [confirmText, setConfirmText] = useState('');

  const isConfirmDisabled = confirmText.trim().toLowerCase() !== confirmKeyword;

  const handleConfirm = () => {
    if (isConfirmDisabled) {
      return;
    }

    onConfirm();
    setConfirmText('');
  };

  const handleClose = () => {
    setConfirmText('');
    closeDialog();
  };

  return (
    <FinSightDialog
      isOpen={isOpen}
      closeDialog={handleClose}
      title={t('deleteDialog.title')}
      titleIcon={WarningAmberRoundedIcon}
    >
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }}>
          <Typography>{t('deleteDialog.description')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('deleteDialog.instruction', {
              keyword: confirmKeyword,
            })}
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            placeholder={t('deleteDialog.placeholder', {
              keyword: confirmKeyword,
            })}
            onChange={e => setConfirmText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isConfirmDisabled) {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={handleClose}>
            {t('deleteDialog.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {t('deleteDialog.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </FinSightDialog>
  );
};

export default UserDeletionDialog;
