import { Button, DialogActions, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import Column from '@/components/shared/layout/containers/Column';

interface RecurringEditChoiceDialogProps extends BaseDialogProps {
  onThisOnly: () => void;
  onThisAndFuture: () => void;
}

const RecurringEditChoiceDialog = ({
  isOpen,
  closeDialog,
  onThisOnly,
  onThisAndFuture,
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
              onThisOnly();
              closeDialog();
            }}
          >
            <Typography variant="body2">{t('editRecurring.thisOnly')}</Typography>
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              onThisAndFuture();
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

export default RecurringEditChoiceDialog;
