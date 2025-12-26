import { useAccounts } from '@/hooks/entities/useAccounts';
import { usePaymentMethods } from '@/hooks/entities/usePaymentMethods';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { Card, Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import ChecklistItem from '@/pages/Overview/SetupPanel/ChecklistItem';
import { ROUTES } from '@/constants/Routes';
import { useTranslation } from 'react-i18next';

const SetupPanel = () => {
  const { t } = useTranslation('overview');
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
          width: 380,
          minHeight: 400,
          padding: 3,
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <Column height={'100%'} justifyContent={'space-between'}>
          <Column spacing={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main">
              {t('setup.title')}
            </Typography>
            <Typography sx={{ opacity: 0.75 }}>{t('setup.subtitle')}</Typography>
            <Column spacing={2} sx={{}}>
              <ChecklistItem
                done={hasAccount}
                label={t('setup.steps.account')}
                navigateTo={ROUTES.ACCOUNTS_URL}
              />
              <ChecklistItem
                done={hasPaymentMethod}
                label={t('setup.steps.paymentMethod')}
                navigateTo={ROUTES.PAYMENT_METHODS_URL}
              />
              <ChecklistItem
                done={hasTransaction}
                label={t('setup.steps.transaction')}
                navigateTo={ROUTES.TRANSACTIONS_URL}
              />
            </Column>
          </Column>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>
            {t('setup.footer')}
          </Typography>
        </Column>
      </Card>
    </Column>
  );
};

export default SetupPanel;
