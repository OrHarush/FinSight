import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import ChecklistItem from '@/pages/Dashboard/ChecklistItem';
import { ROUTES } from '@/constants/Routes';

const DashboardSetupPanel = () => {
  const { accounts } = useAccounts();
  const { paymentMethods } = usePaymentMethods();
  const { transactions } = useTransactions();

  const hasAccount = accounts.length > 0;
  const hasPaymentMethod = paymentMethods.length > 0;
  const hasTransaction = transactions.length > 0;

  return (
    <Column width="100%" minHeight="60vh" justifyContent="center" alignItems="center">
      <Card
        sx={{
          width: 420,
          minHeight: 400,
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom color={'primary.main'}>
            Let’s get you set up
          </Typography>
          <Typography sx={{ opacity: 0.75, maxWidth: 320, mb: 3 }}>
            Complete the steps below to unlock your financial dashboard
          </Typography>
          <Box
            sx={{
              height: 1,
              background:
                'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(139,92,246,0.15), transparent)',
              mb: 3,
            }}
          />
          <Column spacing={1.5}>
            <ChecklistItem
              done={hasAccount}
              label="Create your first account"
              navigateTo={ROUTES.ACCOUNTS_URL}
            />
            <ChecklistItem
              done={hasPaymentMethod}
              label="Add a payment method"
              navigateTo={ROUTES.PAYMENT_METHODS_URL}
            />
            <ChecklistItem
              done={hasTransaction}
              label="Add your first transaction"
              navigateTo={ROUTES.TRANSACTIONS_URL}
            />
          </Column>
          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              You can complete these steps in any order
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Column>
  );
};

export default DashboardSetupPanel;
