import { PaymentMethodType } from '@lyra/shared';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Typography } from '@mui/material';

import bitImage from '@/assets/bit.webp';
import payboxImage from '@/assets/paybox.png';
import paypalImage from '@/assets/paypal.png';
import { CURRENCIES } from '@/constants/currencies';
import { useAuth } from '@/providers/AuthProvider';

interface FlatCardTypeIconProps {
  type: PaymentMethodType;
}

const ICON_SIZE = 54;
const ICON_RADIUS = '10px';

const CURRENCY_SYMBOLS: Record<string, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const TYPE_ICON_CONFIG: Partial<Record<PaymentMethodType, { bg: string; iconColor: string }>> = {
  'Bank Transfer': { bg: '#E6F1FB', iconColor: '#185FA5' },
  Checks: { bg: '#EAF3DE', iconColor: '#3B6D11' },
  'Standing Order': { bg: '#FAEEDA', iconColor: '#854F0B' },
  Cash: { bg: '#F1EFE8', iconColor: '#5F5E5A' },
};

const renderMuiIconContent = (type: PaymentMethodType, currencySymbol: string) => {
  const config = TYPE_ICON_CONFIG[type];

  if (!config) {
    return null;
  }

  if (type === 'Bank Transfer') {
    return <AccountBalanceIcon sx={{ fontSize: 30, color: config.iconColor }} />;
  }

  if (type === 'Checks') {
    return <ReceiptLongIcon sx={{ fontSize: 30, color: config.iconColor }} />;
  }

  if (type === 'Standing Order') {
    return <AutorenewIcon sx={{ fontSize: 30, color: config.iconColor }} />;
  }

  if (type === 'Cash') {
    return (
      <Typography
        sx={{ fontSize: '1.15rem', fontWeight: 700, color: config.iconColor, lineHeight: 1 }}
      >
        {currencySymbol}
      </Typography>
    );
  }

  return null;
};

const FlatCardTypeIcon = ({ type }: FlatCardTypeIconProps) => {
  const { user } = useAuth();
  const currencyCode = user?.displayCurrency ?? 'ILS';
  const currencySymbol =
    CURRENCY_SYMBOLS[currencyCode] ??
    CURRENCIES.find(c => c.value === currencyCode)?.label.split(' ')[0] ??
    '₪';

  if (type === 'PayPal') {
    return (
      <Box
        component="img"
        src={paypalImage}
        alt="PayPal"
        sx={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_RADIUS,
          objectFit: 'contain',
          backgroundColor: '#003087',
          p: 0.75,
          flexShrink: 0,
        }}
      />
    );
  }

  if (type === 'Bit') {
    return (
      <Box
        component="img"
        src={bitImage}
        alt="Bit"
        sx={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_RADIUS,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  if (type === 'PayBox') {
    return (
      <Box
        component="img"
        src={payboxImage}
        alt="PayBox"
        sx={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_RADIUS,
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  const config = TYPE_ICON_CONFIG[type];

  return (
    <Box
      sx={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: ICON_RADIUS,
        backgroundColor: config?.bg ?? 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {renderMuiIconContent(type, currencySymbol)}
    </Box>
  );
};

export default FlatCardTypeIcon;
