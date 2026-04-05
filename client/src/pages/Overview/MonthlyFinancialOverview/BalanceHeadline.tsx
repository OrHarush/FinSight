import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';

export interface BalanceHeadlineProps {
  balance: number;
  label: string;
  asOfDate?: Date | string;
  tooltip?: string;
}

const BalanceHeadline = ({ balance, label, asOfDate, tooltip }: BalanceHeadlineProps) => {
  const { i18n, t } = useTranslation('overview');

  const formattedDate = asOfDate
    ? new Date(asOfDate).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })
    : null;

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
        {tooltip && (
          <Tooltip title={tooltip} placement="top" arrow>
            <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled', cursor: 'help' }} />
          </Tooltip>
        )}
      </Row>
    </Column>
  );
};

export default BalanceHeadline;
