import { useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
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
  onAssign: (categoryId: string, indices: number[]) => void;
  onRenameRow: (index: number, name: string) => void;
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
  onAssign,
  onRenameRow,
  bulkAssign,
  onConfirmBulkAssign,
  onDismissBulkAssign,
  bulkRename,
  onConfirmBulkRename,
  onDismissBulkRename,
}: MobileCategorizeViewProps) => {
  const [sheetOpenForIndex, setSheetOpenForIndex] = useState<number | null>(null);

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
            onChipClick={() => setSheetOpenForIndex(index)}
            onRenameRow={name => onRenameRow(index, name)}
          />
        ))}
      </Column>

      <CategoryBottomSheet
        open={sheetOpenForIndex !== null}
        categories={categories}
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
