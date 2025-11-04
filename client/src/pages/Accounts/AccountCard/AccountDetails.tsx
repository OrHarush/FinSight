import Row from '@/components/layout/Containers/Row';
import { Typography } from '@mui/material';
import CurrencyText from '@/components/appCommon/CurrencyText';
import Column from '@/components/layout/Containers/Column';
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
          {t('info.openingBalance')}:
        </Typography>
        <CurrencyText fontWeight={600} value={account.balance} />
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('info.institution')}:
        </Typography>
        <Typography fontWeight={500}>{account.institution}</Typography>
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('info.accountNumber')}:
        </Typography>
        <Typography fontWeight={500}>{account.accountNumber}</Typography>
      </Row>
      <Row justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('info.lastSynced')}:
        </Typography>
        <Typography fontWeight={500}>
          {account.lastSynced
            ? new Date(account.lastSynced).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : t('info.notSynced')}
        </Typography>
      </Row>
    </Column>
  );
};

export default AccountDetails;
