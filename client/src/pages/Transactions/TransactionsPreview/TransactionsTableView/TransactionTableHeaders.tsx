import { TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TransactionTableHeaders = () => {
  const { t } = useTranslation('transactions');

  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ width: '15%' }}> {t('table.name')}</TableCell>
        <TableCell sx={{ width: '10%' }}>{t('table.amount')}</TableCell>
        <TableCell sx={{ width: '20%' }}>{t('table.category')}</TableCell>
        <TableCell sx={{ width: '20%' }}>{t('table.account')}</TableCell>
        <TableCell sx={{ width: '15%' }}>{t('table.recurrence')}</TableCell>
        <TableCell sx={{ width: '15%' }}>{t('table.date')}</TableCell>
        <TableCell sx={{ width: '5%' }} align="center">
          {t('table.actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TransactionTableHeaders;
