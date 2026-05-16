import { Typography } from '@mui/material';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import InfoTooltip from '@/components/shared/ui/InfoTooltip';
import CurrencyText from '@/components/shared/ui/CurrencyText';

export interface BalanceHeadlineProps {
  balance: number;
  label: string;
  asOfDate?: Date | string;
  tooltip?: string | ReactNode;
}

const BalanceHeadline = ({ balance, label, asOfDate, tooltip }: BalanceHeadlineProps) => {
  const { i18n, t } = useTranslation('overview');

  const formattedDate = asOfDate
    ? new Date(asOfDate).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })
    : null;

  const tooltipMaxWidth = typeof tooltip === 'string' || tooltip == null ? undefined : 280;

  return (
    <Column alignItems="center" minWidth={'120px'}>
      <CurrencyText value={balance} variant={'h5'} fontWeight={700} isAnimated />
      <Row alignItems="center" spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
          {formattedDate && (
            <Typography component="span" variant="body2" color="text.disabled">
              {' '}({t('general.asOf')} {formattedDate})
            </Typography>
          )}
        </Typography>
        {tooltip && <InfoTooltip content={tooltip} maxWidth={tooltipMaxWidth} />}
      </Row>
    </Column>
  );
};

export default BalanceHeadline;
