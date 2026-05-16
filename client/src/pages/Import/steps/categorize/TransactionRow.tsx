import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { alpha, Checkbox, Chip, TableCell, TableRow, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useCategoryName } from '@/hooks/entities/useCategoryName';
import InlineNameEditor from '@/pages/Import/steps/categorize/InlineNameEditor';
import useInlineRename from '@/pages/Import/steps/categorize/useInlineRename';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

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
  const { i18n } = useTranslation('transactions');
  const getCategoryName = useCategoryName();
  const isRefund = row.amount < 0;
  const category = categories.find(c => c._id === row.categoryId);
  const { isEditing, editedName, setEditedName, startEdit, commitEdit, handleKeyDown } =
    useInlineRename(row.name, onRenameRow);

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
        {new Date(row.date + 'T00:00:00').toLocaleDateString(i18n.language, {
          month: 'short',
          day: 'numeric',
        })}
      </TableCell>
      <TableCell>
        <InlineNameEditor
          name={row.name}
          isEditing={isEditing}
          editedName={editedName}
          onEditedNameChange={setEditedName}
          onStartEdit={startEdit}
          onCommitEdit={commitEdit}
          onKeyDown={handleKeyDown}
        />
      </TableCell>
      <TableCell
        style={{ textAlign: 'right' }}
        sx={{ whiteSpace: 'nowrap', color: isRefund ? 'success.main' : 'error.main', fontWeight: 500 }}
      >
        {Math.abs(row.amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell sx={{ minWidth: 100 }}>
        {category && (
          <Chip
            label={getCategoryName(category)}
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
