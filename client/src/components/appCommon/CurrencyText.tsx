import { Typography, TypographyProps } from '@mui/material';
import CountUp from 'react-countup';

export interface CurrencyTextProps extends TypographyProps {
  value: number;
  currency?: string;
  locale?: string;
  isAnimated?: boolean;
}

const CurrencyText = ({
  value,
  currency = 'ILS',
  locale = 'he-IL',
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

  return (
    <Typography component="span" dir="ltr" {...typographyProps}>
      {isAnimated ? (
        <CountUp end={value} duration={1.5} decimals={0} suffix="₪" />
      ) : (
        formattedCurrency
      )}
    </Typography>
  );
};

export default CurrencyText;
