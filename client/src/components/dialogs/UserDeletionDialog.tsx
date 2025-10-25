import { useState } from 'react';
import { DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface DeleteAccountDialogProps extends BaseDialogProps {
  onConfirm: () => void;
}

export const UserDeletionDialog = ({
  isOpen,
  closeDialog,
  onConfirm,
}: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === 'delete') {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    closeDialog();
  };

  const isConfirmDisabled = confirmText.toLowerCase() !== 'delete';

  return (
    <FinSightDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={'Delete User'}
      titleIcon={WarningAmberRoundedIcon}
    >
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }}>
          <Typography>
            Are you sure you want to delete this account? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please type <strong>delete</strong> to confirm.
          </Typography>
          <TextField
            fullWidth
            placeholder="Type 'delete' to confirm"
            value={confirmText}
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
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            disabled={isConfirmDisabled}
          >
            Delete Account
          </Button>
        </Row>
      </DialogActions>
    </FinSightDialog>
  );
};

export default UserDeletionDialog;
