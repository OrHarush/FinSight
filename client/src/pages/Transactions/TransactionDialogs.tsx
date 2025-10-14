import CreateTransactionDialog from '@/components/dialogs/TransactionDialogs/CreateTransactionDialog';
import { useSelectedTransaction } from '@/pages/Transactions/SelectedTransactionProvider';
import EditTransactionDialog from '@/components/dialogs/TransactionDialogs/EditTransactionDialog';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { Button, DialogContent, Typography } from '@mui/material';
import { ROUTES } from '@/constants/Routes';
import FinSightDialog from '@/components/dialogs/FinSightDialog';
import { Trans, useTranslation } from 'react-i18next';

interface TransactionDialogsProps {
  isCreateDialogOpen: boolean;
  closeCreateDialog: () => void;
}

const TransactionDialogs = ({ isCreateDialogOpen, closeCreateDialog }: TransactionDialogsProps) => {
  const { t } = useTranslation('transactions');
  const { selectedTransaction, setSelectedTransaction } = useSelectedTransaction();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const needsSetup = !accounts?.length || !categories?.length;

  if (needsSetup) {
    return (
      <FinSightDialog
        title={t('setupDialog.title')}
        isOpen={isCreateDialogOpen}
        closeDialog={closeCreateDialog}
      >
        <DialogContent
          sx={{
            p: 4,
            pt: 0,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <Trans
              ns="transactions"
              i18nKey="setupDialog.message"
              components={{
                account: (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                    onClick={() => navigate(ROUTES.ACCOUNTS_URL)}
                  />
                ),
                category: (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ p: 0, height: '100%', minWidth: 'unset' }}
                    onClick={() => navigate(ROUTES.CATEGORIES_URL)}
                  />
                ),
              }}
            />
          </Typography>
        </DialogContent>
      </FinSightDialog>
    );
  }
  return (
    <>
      {isCreateDialogOpen && (
        <CreateTransactionDialog isOpen={isCreateDialogOpen} closeDialog={closeCreateDialog} />
      )}
      {!!selectedTransaction && (
        <EditTransactionDialog
          isOpen={!!selectedTransaction}
          closeDialog={() => setSelectedTransaction(undefined)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default TransactionDialogs;
