import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ClickAwayListener, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import CurrencyText from '@/components/shared/ui/CurrencyText';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';

export interface BalanceHeadlineProps {
  balance: number;
  label: string;
  asOfDate?: Date | string;
  tooltip?: string;
}

const BalanceHeadline = ({ balance, label, asOfDate, tooltip }: BalanceHeadlineProps) => {
  const { i18n, t } = useTranslation('overview');
  const isSmallScreen = useIsSmallScreen();
  const [open, setOpen] = useState(false);

  const formattedDate = asOfDate
    ? new Date(asOfDate).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })
    : null;

  const iconSx = {
    fontSize: 18,
    color: 'primary.main',
    cursor: isSmallScreen ? 'pointer' : 'help',
    flexShrink: 0,
    opacity: 0.8,
  };

  const renderTooltip = () => {
    if (!tooltip) {
      return null;
    }

    if (!isSmallScreen) {
      return (
        <Tooltip title={tooltip} placement="top" arrow>
          <InfoOutlinedIcon sx={iconSx} />
        </Tooltip>
      );
    }

    return (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Tooltip
          title={tooltip}
          open={open}
          placement="top"
          arrow
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
          <InfoOutlinedIcon
            sx={iconSx}
            onClick={e => {
              e.stopPropagation();
              setOpen(prev => !prev);
            }}
          />
        </Tooltip>
      </ClickAwayListener>
    );
  };

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
        {renderTooltip()}
      </Row>
    </Column>
  );
};

export default BalanceHeadline;
