import Row from '@/components/layout/Containers/Row';
import { IconButton, Typography } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import Column from '@/components/layout/Containers/Column';
import { AccountDto } from '@/types/Account';
import { useTranslation } from 'react-i18next';
import SyncIcon from '@mui/icons-material/Sync';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';

interface AccountDetailsProps {
  account: AccountDto;
}

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { t } = useTranslation('accounts');

  const { mutate: syncBalance, isPending } = useApiMutation<
    { balance: number; syncedAt: string },
    void
  >({
    method: 'post',
    url: API_ROUTES.ACCOUNT_SYNC_BALANCE(account._id),
    queryKeysToInvalidate: [queryKeys.account(account._id), queryKeys.accounts()],
  });

  const syncAccount = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    syncBalance();
  };

  return (
    <Column spacing={1.5}>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('details.openingBalance')}:
        </Typography>
        <CurrencyText fontWeight={600} value={account.balance} />
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('details.institution')}:
        </Typography>
        <Typography fontWeight={500}>{account.institution}</Typography>
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('details.accountNumber')}:
        </Typography>
        <Typography fontWeight={500}>{account.accountNumber}</Typography>
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('details.asOfDate')}:
        </Typography>
        <Row spacing={1}>
          <Typography fontWeight={500}>
            {account.lastSynced
              ? new Date(account.lastSynced).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : t('details.noDataYet')}
          </Typography>
          <IconButton size="small" sx={{ padding: 0 }} onClick={syncAccount} disabled={isPending}>
            <SyncIcon
              sx={{
                animation: isPending ? 'spin 1s linear infinite' : undefined,
              }}
            />
          </IconButton>
        </Row>
      </Row>
    </Column>
  );
};

export default AccountDetails;
