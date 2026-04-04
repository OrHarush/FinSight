import { alpha, Checkbox, Chip, TableCell, TableRow, Typography, useTheme } from '@mui/material';

import { WizardRow } from '@/pages/Import/ImportWizardContext';
import { CategoryDto } from '@/types/Category';

const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

interface TransactionRowProps {
  row: WizardRow;
  categories: CategoryDto[];
  isDragging: boolean;
  onToggleSelected: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const TransactionRow = ({
  row,
  categories,
  isDragging,
  onToggleSelected,
  onDragStart,
  onDragEnd,
}: TransactionRowProps) => {
  const theme = useTheme();
  const category = categories.find(c => c._id === row.categoryId);

  return (
    <TableRow
      draggable
      onDragStart={e => {
        e.stopPropagation();
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      selected={row.selected}
      sx={{
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        '&.MuiTableRow-root.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
        },
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          size="small"
          checked={row.selected}
          onChange={onToggleSelected}
          onClick={e => e.stopPropagation()}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', width: 80 }}>
        {formatDate(row.date)}
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap sx={{ maxWidth: 240 }}>
          {row.name || '—'}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        sx={{
          whiteSpace: 'nowrap',
          color: row.amount < 0 ? 'error.main' : 'success.main',
        }}
      >
        {row.amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell sx={{ minWidth: 130 }}>
        {category && (
          <Chip
            label={category.name}
            size="small"
            sx={{ bgcolor: category.color, color: '#fff', fontSize: '0.7rem', maxWidth: 130 }}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
