import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Box,Card, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreateTransactionDialog from '@/components/features/transactions/CreateTransactionDialog';
import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import { useTransactions } from '@/hooks/entities/useTransactions';
import CreateTransactionButton from '@/pages/Overview/SetupPanel/CreateTransactionButton';

const SetupPanel = () => {
  const { t } = useTranslation('overview');
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedType, setSelectedType] = useState<'Income' | 'Expense'>('Expense');

  const hasTransaction = transactions.length > 0;

  if (hasTransaction) {
    return null;
  }

  const openIncomeDialog = () => {
    setSelectedType('Income');
    openCreateDialog();
  };

  const openExpenseDialog = () => {
    setSelectedType('Expense');
    openCreateDialog();
  };

  return (
    <>
      <Column width="100%" minHeight="60vh" justifyContent="center" alignItems="center">
        <Card
          sx={{
            width: '100%',
            maxWidth: '560px',
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Column spacing={3} alignItems="center">
            <Box
              sx={{
                backgroundColor: '#673ab720',
                borderRadius: '12px',
                width: 56,
                minWidth: 56,
                height: 56,
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <CreditCardIcon sx={{ fontSize: 28, color: '#673ab7' }} />
            </Box>
            <Column spacing={1}>
              <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight={500}>
                {t('setup.firstTransactionTitle')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}
              >
                {t('setup.firstTransactionDescription')}
              </Typography>
            </Column>
            <ResponsiveRow width="100%" spacing={2} justifyContent="center" flexWrap="wrap">
              <CreateTransactionButton
                type="Income"
                label={t('setup.addIncome')}
                onClick={openIncomeDialog}
              />
              <CreateTransactionButton
                type="Expense"
                label={t('setup.addExpense')}
                onClick={openExpenseDialog}
              />
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
