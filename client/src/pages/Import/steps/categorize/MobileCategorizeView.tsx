import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import BulkAssignPrompt from '@/pages/Import/steps/categorize/BulkAssignPrompt';
import BulkRenamePrompt from '@/pages/Import/steps/categorize/BulkRenamePrompt';
import CategoryBottomSheet from '@/pages/Import/steps/categorize/CategoryBottomSheet';
import MobileTransactionCard from '@/pages/Import/steps/categorize/MobileTransactionCard';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

interface BulkAssignState {
  name: string;
  indices: number[];
  categoryId: string;
}

interface BulkRenameState {
  oldName: string;
  newName: string;
  indices: number[];
}

interface MobileCategorizeViewProps {
  rows: WizardRow[];
  categories: CategoryDto[];
  incomeCategories: CategoryDto[];
  onAssign: (categoryId: string, indices: number[]) => void;
  onRenameRow: (index: number, name: string) => void;
  onDeleteRows: (indices: number[]) => void;
  bulkAssign: BulkAssignState | null;
  onConfirmBulkAssign: () => void;
  onDismissBulkAssign: () => void;
  bulkRename: BulkRenameState | null;
  onConfirmBulkRename: () => void;
  onDismissBulkRename: () => void;
}

const MobileCategorizeView = ({
  rows,
  categories,
  incomeCategories,
  onAssign,
  onRenameRow,
  onDeleteRows,
  bulkAssign,
  onConfirmBulkAssign,
  onDismissBulkAssign,
  bulkRename,
  onConfirmBulkRename,
  onDismissBulkRename,
}: MobileCategorizeViewProps) => {
  const { t } = useTranslation('transactions');
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [sheetOpenForIndex, setSheetOpenForIndex] = useState<number | null>(null);
  const [categoriesForSheet, setCategoriesForSheet] = useState<CategoryDto[]>(categories);

  const openSheet = (index: number) => {
    setCategoriesForSheet(rows[index].amount < 0 ? incomeCategories : categories);
    setSheetOpenForIndex(index);
  };

  const isSelectionMode = selectedIndices.size > 0;

  const enterSelectionMode = (index: number) => {
    setSelectedIndices(new Set([index]));
  };

  const toggleSelect = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const deleteSelected = () => {
    onDeleteRows(Array.from(selectedIndices));
    setSelectedIndices(new Set());
  };

  const assignCategory = (categoryId: string) => {
    if (sheetOpenForIndex !== null) {
      onAssign(categoryId, [sheetOpenForIndex]);
    }
  };

  return (
    <>
      <Column spacing={1.5} sx={{ overflowY: 'auto', flex: 1, pb: 2 }}>
        {rows.map((row, index) => (
          <MobileTransactionCard
            key={index}
            row={row}
            categories={categories}
            isSelected={selectedIndices.has(index)}
            isSelectionMode={isSelectionMode}
            onChipClick={() => !isSelectionMode && openSheet(index)}
            onRenameRow={name => onRenameRow(index, name)}
            onLongPress={() => enterSelectionMode(index)}
            onToggleSelect={() => toggleSelect(index)}
          />
        ))}
      </Column>

      {isSelectionMode && (
        <Row justifyContent="center" sx={{ pt: 1, pb: 0.5 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={deleteSelected}
          >
            {t('importWizard.categorize.deleteSelectedCount', { count: selectedIndices.size })}
          </Button>
        </Row>
      )}

      <CategoryBottomSheet
        open={sheetOpenForIndex !== null}
        categories={categoriesForSheet}
        onSelect={assignCategory}
        onClose={() => setSheetOpenForIndex(null)}
      />

      {bulkAssign && (
        <BulkAssignPrompt
          merchantName={bulkAssign.name}
          count={bulkAssign.indices.length}
          onConfirm={onConfirmBulkAssign}
          onDismiss={onDismissBulkAssign}
        />
      )}

      {bulkRename && (
        <BulkRenamePrompt
          oldName={bulkRename.oldName}
          newName={bulkRename.newName}
          count={bulkRename.indices.length}
          onConfirm={onConfirmBulkRename}
          onDismiss={onDismissBulkRename}
        />
      )}
    </>
  );
};

export default MobileCategorizeView;
