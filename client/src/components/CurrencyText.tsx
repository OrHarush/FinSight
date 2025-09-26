import { Typography, TypographyProps } from '@mui/material';

export interface CurrencyTextProps extends TypographyProps {
  value: number;
  currency?: string;
  locale?: string;
}

const CurrencyText = ({
  value,
  currency = 'ILS',
  locale = 'he-IL',
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
    <Typography component="span" {...typographyProps}>
      {formattedCurrency}
    </Typography>
  );
};

export default CurrencyText;
