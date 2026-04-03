import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import Column from '@/components/shared/layout/containers/Column';

interface RecurringEditChoiceDialogProps extends BaseDialogProps {
  editSingleOccurrence: () => void;
  editThisAndFutureOccurrences: () => void;
}

const EditRecurringTransactionDialog = ({
  isOpen,
  closeDialog,
  editSingleOccurrence,
  editThisAndFutureOccurrences,
}: RecurringEditChoiceDialogProps) => {
  const { t } = useTranslation('transactions');

  return (
    <FinSightDialog isOpen={isOpen} closeDialog={closeDialog} title={t('editRecurring.title')}>
      <DialogContent>
        <Column spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              editSingleOccurrence();
              closeDialog();
            }}
          >
            <Typography variant="body2">{t('editRecurring.thisOnly')}</Typography>
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              editThisAndFutureOccurrences();
              closeDialog();
            }}
          >
            <Typography variant="body2">{t('editRecurring.thisAndFuture')}</Typography>
          </Button>
        </Column>
      </DialogContent>
      <DialogActions />
    </FinSightDialog>
  );
};

export default EditRecurringTransactionDialog;
