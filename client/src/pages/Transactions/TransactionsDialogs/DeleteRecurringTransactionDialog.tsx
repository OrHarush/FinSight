import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';

interface RecurringDeleteChoiceDialogProps extends BaseDialogProps {
  deleteSingleOccurrence: () => void;
  deleteThisAndFutureOccurrences: () => void;
}

const DeleteRecurringTransactionDialog = ({
  isOpen,
  closeDialog,
  deleteSingleOccurrence,
  deleteThisAndFutureOccurrences,
}: RecurringDeleteChoiceDialogProps) => {
  const { t } = useTranslation('transactions');

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('deleteRecurring.title')}
      titleIcon={WarningAmberRoundedIcon}
    >
      <DialogContent>
        <Column spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t('deleteRecurring.warning')}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              deleteSingleOccurrence();
              closeDialog();
            }}
          >
            {t('deleteRecurring.thisOnly')}
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => {
              deleteThisAndFutureOccurrences();
              closeDialog();
            }}
          >
            {t('deleteRecurring.thisAndFuture')}
          </Button>
        </Column>
      </DialogContent>
      <DialogActions />
    </LyraDialog>
  );
};

export default DeleteRecurringTransactionDialog;
