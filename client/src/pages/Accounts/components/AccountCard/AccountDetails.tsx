import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { AccountDto } from '@/types/Account';

interface AccountDetailsProps {
  account: AccountDto;
}

const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { t, i18n } = useTranslation('accounts');

  const formattedCheckpointDate = account.checkpointDate
    ? new Date(account.checkpointDate).toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'short',
      })
    : null;

  return (
    <Column spacing={1.5}>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body2" color="text.secondary">
          {t('details.openingBalance')}:
        </Typography>
        <Column alignItems="flex-end" spacing={0}>
          <CurrencyText fontWeight={600} value={account.balance} currency={account.currency} />
          {formattedCheckpointDate && (
            <Typography variant="caption" color="text.secondary">
              {t('details.checkpointFrom')} {formattedCheckpointDate}
            </Typography>
          )}
        </Column>
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
    </Column>
  );
};

export default AccountDetails;
