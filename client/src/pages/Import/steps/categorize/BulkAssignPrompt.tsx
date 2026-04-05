import { Button, Snackbar, SnackbarContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BulkAssignPromptProps {
  merchantName: string;
  count: number;
  onConfirm: () => void;
  onDismiss: () => void;
}

const BulkAssignPrompt = ({ merchantName, count, onConfirm, onDismiss }: BulkAssignPromptProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <SnackbarContent
        message={t('importWizard.categorize.bulkAssign.message', {
          name: merchantName,
          count,
        })}
        action={
          <>
            <Button size="small" sx={{ mr: 1 }} onClick={onDismiss}>
              {t('importWizard.categorize.bulkAssign.dismiss')}
            </Button>
            <Button size="small" color="primary" variant="contained" onClick={onConfirm}>
              {t('importWizard.categorize.bulkAssign.confirm')}
            </Button>
          </>
        }
      />
    </Snackbar>
  );
};

export default BulkAssignPrompt;
