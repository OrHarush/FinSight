import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ReviewTableRow from './ReviewTableRow';
import { ReviewViewProps } from './reviewTypes';

const ReviewTableView = ({ fields, categories, transactionById }: ReviewViewProps) => {
  const { t } = useTranslation('transactions');

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('review.columns.date')}</TableCell>
            <TableCell>{t('review.columns.name')}</TableCell>
            <TableCell align="center">{t('review.columns.amount')}</TableCell>
            <TableCell>{t('review.columns.category')}</TableCell>
            <TableCell align="center">{t('review.columns.applyToFuture')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => {
            const transaction = transactionById.get(field.txId);

            if (!transaction) {
              return null;
            }

            return (
              <ReviewTableRow
                key={field.id}
                index={index}
                transaction={transaction}
                categories={categories}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReviewTableView;
