import { useState } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import BulkAssignPrompt from '@/pages/Import/steps/categorize/BulkAssignPrompt';
import CategoryBottomSheet from '@/pages/Import/steps/categorize/CategoryBottomSheet';
import MobileTransactionCard from '@/pages/Import/steps/categorize/MobileTransactionCard';
import { WizardRow } from '@/pages/Import/types/importWizard';
import { CategoryDto } from '@/types/Category';

interface BulkAssignState {
  name: string;
  indices: number[];
  categoryId: string;
}

interface MobileCategorizeViewProps {
  rows: WizardRow[];
  categories: CategoryDto[];
  onAssign: (categoryId: string, indices: number[]) => void;
  bulkAssign: BulkAssignState | null;
  onConfirmBulkAssign: () => void;
  onDismissBulkAssign: () => void;
}

const MobileCategorizeView = ({
  rows,
  categories,
  onAssign,
  bulkAssign,
  onConfirmBulkAssign,
  onDismissBulkAssign,
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
    </>
  );
};

export default MobileCategorizeView;
