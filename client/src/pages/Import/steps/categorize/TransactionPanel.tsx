import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { WizardRow } from '@/pages/Import/ImportWizardContext';
import TransactionRow from '@/pages/Import/steps/categorize/TransactionRow';
import { CategoryDto } from '@/types/Category';

interface TransactionPanelProps {
  rows: WizardRow[];
  categories: CategoryDto[];
  draggingIndices: number[];
  onToggleSelected: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}

const TransactionPanel = ({
  rows,
  categories,
  draggingIndices,
  onToggleSelected,
  onDragStart,
  onDragEnd,
}: TransactionPanelProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Paper variant="outlined" sx={{ flex: 1, borderRadius: 2, overflow: 'auto' }}>
      {rows.length === 0 ? (
        <Column alignItems="center" justifyContent="center" height="100%" p={4}>
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.categorize.empty')}
          </Typography>
        </Column>
      ) : (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>{t('importWizard.upload.col.date')}</TableCell>
              <TableCell>{t('importWizard.upload.col.name')}</TableCell>
              <TableCell align="right">{t('importWizard.upload.col.amount')}</TableCell>
              <TableCell>{t('fields.category')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TransactionRow
                key={index}
                row={row}
                categories={categories}
                isDragging={draggingIndices.includes(index)}
                onToggleSelected={() => onToggleSelected(index)}
                onDragStart={() => onDragStart(index)}
                onDragEnd={onDragEnd}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default TransactionPanel;
