import { DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';
import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';

export interface DeletionConfirmationDialogProps extends BaseDialogProps {
  onConfirm: () => void;
  entityType: string;
  entityName?: string;
  message?: ReactNode;
  disabledReason?: string;
}

const DeletionConfirmationDialog = ({
  isOpen,
  closeDialog,
  onConfirm,
  entityType,
  entityName,
  message,
  disabledReason,
}: DeletionConfirmationDialogProps) => {
  const getDefaultMessage = () => {
    if (disabledReason) {
      return disabledReason;
    }

    return (
      <>
        Are you sure you want to delete{' '}
        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {entityName ? `"${entityName}"` : `this ${entityType}`}
        </Box>
        ?
        <br />
        <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.95em' }}>
          This action cannot be undone.
        </Box>
      </>
    );
  };

  return (
    <FinSightDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={`Delete ${entityType}`}
      titleIcon={WarningAmberRoundedIcon}
      onClick={e => e.stopPropagation()}
    >
      <DialogContent>
        <Column spacing={2.5} alignItems="flex-start">
          <Column spacing={0.5} sx={{ flex: 1 }}>
            <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
              {message || getDefaultMessage()}
            </Typography>
          </Column>
        </Column>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Row spacing={1.5} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Button onClick={closeDialog} variant="outlined" sx={{ minWidth: 90 }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              closeDialog();
            }}
            color="error"
            variant="contained"
            disabled={!!disabledReason}
            sx={{ minWidth: 90 }}
          >
            Delete
          </Button>
        </Row>
      </DialogActions>
    </FinSightDialog>
  );
};

export default DeletionConfirmationDialog;
