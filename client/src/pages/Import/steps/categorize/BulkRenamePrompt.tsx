import { Button, Snackbar, SnackbarContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface BulkRenamePromptProps {
  oldName: string;
  newName: string;
  count: number;
  onConfirm: () => void;
  onDismiss: () => void;
}

const BulkRenamePrompt = ({
  oldName,
  newName,
  count,
  onConfirm,
  onDismiss,
}: BulkRenamePromptProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Snackbar open anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <SnackbarContent
        message={t('importWizard.categorize.bulkRename.message', {
          count,
          oldName,
          newName,
        })}
        action={
          <>
            <Button size="small" color="primary" variant="contained" onClick={onConfirm}>
              {t('importWizard.categorize.bulkRename.confirm')}
            </Button>
            <Button size="small" sx={{ ml: 1 }} onClick={onDismiss}>
              {t('importWizard.categorize.bulkRename.dismiss')}
            </Button>
          </>
        }
      />
    </Snackbar>
  );
};

export default BulkRenamePrompt;
