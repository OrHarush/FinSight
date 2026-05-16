import { alpha, Card, Checkbox, Chip, Typography, useTheme } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useCategoryName } from '@/hooks/entities/useCategoryName';
import InlineNameEditor from '@/pages/Import/steps/categorize/InlineNameEditor';
import useInlineRename from '@/pages/Import/steps/categorize/useInlineRename';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

const LONG_PRESS_DELAY = 500;

interface MobileTransactionCardProps {
  row: WizardRow;
  categories: CategoryDto[];
  isSelected: boolean;
  isSelectionMode: boolean;
  onChipClick: () => void;
  onRenameRow: (name: string) => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
}

const MobileTransactionCard = ({
  row,
  categories,
  isSelected,
  isSelectionMode,
  onChipClick,
  onRenameRow,
  onLongPress,
  onToggleSelect,
}: MobileTransactionCardProps) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation('transactions');
  const getCategoryName = useCategoryName();
  const isRefund = row.amount < 0;
  const category = categories.find(c => c._id === row.categoryId);
  const { isEditing, editedName, setEditedName, startEdit, commitEdit, handleKeyDown } =
    useInlineRename(row.name, onRenameRow);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      onLongPress();
    }, LONG_PRESS_DELAY);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const toggleCardSelection = () => {
    if (isSelectionMode) {
      onToggleSelect();
    }
  };

  return (
    <Card
      variant="outlined"
      onPointerDown={startLongPress}
      onPointerUp={cancelLongPress}
      onPointerLeave={cancelLongPress}
      onClick={toggleCardSelection}
      sx={{
        px: 2,
        py: 2,
        minHeight: 72,
        borderRadius: 2,
        flexShrink: 0,
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'background.paper',
        borderColor: isSelected
          ? theme.palette.primary.main
          : category
            ? alpha(category.color, 0.3)
            : theme.palette.divider,
        userSelect: 'none',
        cursor: isSelectionMode ? 'pointer' : 'default',
      }}
    >
      <Row justifyContent="space-between" alignItems="flex-start" spacing={1}>
        {isSelectionMode && (
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={onToggleSelect}
            onClick={e => e.stopPropagation()}
            sx={{ mt: -0.5, ml: -1 }}
          />
        )}
        <Column spacing={0.5} minWidth={0} flex={1}>
          <InlineNameEditor
            name={row.name}
            isEditing={isEditing && !isSelectionMode}
            editedName={editedName}
            maxWidth="100%"
            onEditedNameChange={setEditedName}
            onStartEdit={startEdit}
            onCommitEdit={commitEdit}
            onKeyDown={handleKeyDown}
          />
          <Row spacing={0.75} alignItems="center">
            <Typography variant="caption" color="text.disabled">
              {new Date(row.date + 'T00:00:00').toLocaleDateString(i18n.language, {
                month: 'short',
                day: 'numeric',
              })}
            </Typography>
            {isRefund && (
              <Chip
                label={t('importWizard.categorize.refund')}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  border: `1.5px solid ${theme.palette.primary.main}`,
                  color: 'primary.main',
                  fontSize: '0.6rem',
                  height: 16,
                }}
              />
            )}
          </Row>
        </Column>
        <Column alignItems="flex-end" spacing={0.75} flexShrink={0}>
          <Typography variant="body2" fontWeight={600} color={isRefund ? 'success.main' : 'error.main'}>
            {Math.abs(row.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          {!isSelectionMode && (
            <Chip
              label={category ? getCategoryName(category) : t('importWizard.categorize.addCategory')}
              size="small"
              onClick={onChipClick}
              sx={
                category
                  ? {
                      bgcolor: 'transparent',
                      border: `1.5px solid ${category.color}`,
                      color: category.color,
                      fontSize: '0.7rem',
                      height: 22,
                      cursor: 'pointer',
                    }
                  : {
                      bgcolor: 'transparent',
                      border: `1.5px dashed ${theme.palette.text.disabled}`,
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      height: 22,
                      cursor: 'pointer',
                    }
              }
            />
          )}
        </Column>
      </Row>
    </Card>
  );
};

export default MobileTransactionCard;
