export interface Currency {
  value: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { value: 'ILS', label: '₪ ILS' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
  { value: 'JPY', label: '¥ JPY' },
];

