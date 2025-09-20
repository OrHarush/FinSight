export const formatCurrency = (value: number) =>
  value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' });
