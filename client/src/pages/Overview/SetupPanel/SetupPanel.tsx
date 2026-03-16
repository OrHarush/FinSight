import { useTransactions } from '@/hooks/entities/useTransactions';
import { Card, Typography, Button } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import { useOpen } from '@/hooks/common/useOpen';
import { useState } from 'react';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';

const SetupPanel = () => {
  const { t } = useTranslation('overview');
  const { transactions } = useTransactions();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedType, setSelectedType] = useState<'Income' | 'Expense'>('Expense');

  const hasTransaction = transactions.length > 0;

  const openIncomeDialog = () => {
    setSelectedType('Income');
    openCreateDialog();
  };

  const openExpenseDialog = () => {
    setSelectedType('Expense');
    openCreateDialog();
  };

  if (hasTransaction) {
    return null;
  }

  return (
    <>
      <Column
        width="100%"
        minHeight="60vh"
        justifyContent="center"
        alignItems="center"
        px={{ sm: 3 }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 680,
            px: { xs: 0, sm: 4 },
            py: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
            textAlign: 'center',
          }}
        >
          <Column height={'100%'} spacing={3} alignItems="center">
            <Column spacing={1}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {t('setup.emptyTitle')}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.75 }}>
                {t('setup.emptyDescription')}
              </Typography>
            </Column>

            <ResponsiveRow width="100%" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                color="success"
                size="large"
                startIcon={<AddIcon />}
                onClick={openIncomeDialog}
                sx={{
                  width: '180px',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {t('setup.addIncome')}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<AddIcon />}
                onClick={openExpenseDialog}
                sx={{
                  width: '180px',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {t('setup.addExpense')}
              </Button>
            </ResponsiveRow>
          </Column>
        </Card>
      </Column>
      <CreateTransactionDialog
        isOpen={isCreateDialogOpen}
        closeDialog={closeCreateDialog}
        initialType={selectedType}
      />
    </>
  );
};

export default SetupPanel;
