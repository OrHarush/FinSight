import { Typography, TypographyProps } from '@mui/material';
import CountUp from 'react-countup';

export interface CurrencyTextProps extends TypographyProps {
  value: number;
  currency?: string;
  locale?: string;
  hasColor?: boolean;
  hasSign?: boolean;
  isAnimated?: boolean;
}

const CurrencyText = ({
  value,
  currency = 'ILS',
  locale = 'he-IL',
  hasColor = false,
  hasSign = false,
  isAnimated = false,
  ...typographyProps
}: CurrencyTextProps) => {
  const formattedCurrency = value
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    })
    .replace(/\s+/g, '');

  const color = value >= 0 ? 'success.main' : 'error.main'

  return (
    <Typography component="span" dir="ltr" {...typographyProps} color={hasColor ? color : typographyProps.color}>
      {(hasSign && value > 0) && '+'}
      {isAnimated ? (
        <CountUp end={value} duration={1.5} decimals={0} suffix="₪" />
      ) : (
        formattedCurrency
      )}
    </Typography>
  );
};

export default CurrencyText;
