import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  alpha,
  Checkbox,
  Chip,
  InputBase,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

import { WizardRow } from '@/pages/Import/types/importWizard';
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
  onRenameRow: (name: string) => void;
}

const TransactionRow = ({
  row,
  categories,
  isDragging,
  onToggleSelected,
  onDragStart,
  onDragEnd,
  onRenameRow,
}: TransactionRowProps) => {
  const theme = useTheme();
  const category = categories.find(c => c._id === row.categoryId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(row.name);

  const startDrag = (e: React.DragEvent) => {
    e.stopPropagation();

    const ghost = document.createElement('div');
    ghost.style.cssText = [
      'position:fixed',
      'top:-9999px',
      'left:-9999px',
      `background:${theme.palette.background.paper}`,
      `color:${theme.palette.text.primary}`,
      'padding:8px 14px',
      'border-radius:8px',
      `box-shadow:0 4px 16px ${alpha(theme.palette.common.black, 0.35)}`,
      'font-size:13px',
      `border:1px solid ${theme.palette.divider}`,
      'max-width:240px',
      'white-space:nowrap',
      'overflow:hidden',
      'text-overflow:ellipsis',
      'pointer-events:none',
    ].join(';');
    ghost.textContent = row.name || 'Transaction';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => document.body.removeChild(ghost), 0);

    onDragStart();
  };

  const commitNameEdit = () => {
    setIsEditingName(false);

    if (editedName.trim() !== row.name) {
      onRenameRow(editedName.trim());
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitNameEdit();
    }

    if (e.key === 'Escape') {
      setEditedName(row.name);
      setIsEditingName(false);
    }
  };

  const startNameEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedName(row.name);
    setIsEditingName(true);
  };

  return (
    <TableRow
      draggable
      onDragStart={startDrag}
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
      <TableCell padding="checkbox" sx={{ pr: 0 }}>
        <Checkbox
          size="small"
          checked={row.selected}
          onChange={onToggleSelected}
          onClick={e => e.stopPropagation()}
        />
      </TableCell>
      <TableCell sx={{ pl: 0.5, pr: 0.5, color: 'text.disabled' }}>
        <DragIndicatorIcon
          fontSize="small"
          sx={{ display: 'block', opacity: 0.4, cursor: 'grab' }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary', width: 68 }}>
        {formatDate(row.date)}
      </TableCell>
      <TableCell>
        {isEditingName ? (
          <InputBase
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            onBlur={commitNameEdit}
            onKeyDown={handleNameKeyDown}
            autoFocus
            inputProps={{ style: { fontSize: '0.875rem', padding: 0 } }}
            sx={{
              width: '100%',
              maxWidth: 180,
              fontSize: '0.875rem',
              '& input': {
                borderBottom: `1px solid ${theme.palette.primary.main}`,
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            noWrap
            onClick={startNameEdit}
            sx={{
              maxWidth: 180,
              cursor: 'text',
              '&:hover': {
                textDecoration: 'underline dotted',
                textDecorationColor: 'text.disabled',
              },
            }}
          >
            {row.name || '—'}
          </Typography>
        )}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          whiteSpace: 'nowrap',
          color: 'error.main',
          fontWeight: 500,
        }}
      >
        {Math.abs(row.amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell sx={{ minWidth: 100 }}>
        {category && (
          <Chip
            label={category.name}
            size="small"
            sx={{
              bgcolor: 'transparent',
              border: `1.5px solid ${category.color}`,
              color: category.color,
              fontSize: '0.7rem',
              maxWidth: 110,
              height: 20,
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
