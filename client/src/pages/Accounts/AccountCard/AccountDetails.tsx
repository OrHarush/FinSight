import Row from '@/components/shared/layout/containers/Row';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import Column from '@/components/shared/layout/containers/Column';
import { AccountDto } from '@/types/Account';
import { useTranslation } from 'react-i18next';

interface AccountDetailsProps {
  account: AccountDto;
}

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { t } = useTranslation('accounts');

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
        </Row>
      </Row>
    </Column>
  );
};

export default AccountDetails;
