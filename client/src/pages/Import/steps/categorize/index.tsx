import { LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useCategories } from '@/hooks/entities/useCategories';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import BulkAssignPrompt from '@/pages/Import/steps/categorize/BulkAssignPrompt';
import BulkRenamePrompt from '@/pages/Import/steps/categorize/BulkRenamePrompt';
import CategoryPanel from '@/pages/Import/steps/categorize/CategoryPanel';
import MobileCategorizeView from '@/pages/Import/steps/categorize/MobileCategorizeView';
import TransactionPanel from '@/pages/Import/steps/categorize/TransactionPanel';

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

const CategorizeStep = () => {
  const { t } = useTranslation('transactions');
  const {
    rows,
    toggleRowSelected,
    toggleAllSelected,
    updateRowCategory,
    updateRowName,
    setCanProceed,
  } = useImportWizard();
  const { categories } = useCategories();
  const isMobile = useIsMobile();
  const [draggingIndices, setDraggingIndices] = useState<number[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const [bulkAssign, setBulkAssign] = useState<BulkAssignState | null>(null);
  const [bulkRename, setBulkRename] = useState<BulkRenameState | null>(null);

  const expenseCategories = categories.filter(c => c.type === 'Expense');

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const categorizedCount = rows.filter(r => r.categoryId !== null).length;
  const total = rows.length;
  const progress = total > 0 ? (categorizedCount / total) * 100 : 0;

  const startDragging = (index: number) => {
    if (rows[index].selected) {
      setDraggingIndices(rows.map((r, i) => (r.selected ? i : -1)).filter(i => i >= 0));
    } else {
      setDraggingIndices([index]);
    }
  };

  const stopDragging = () => {
    setDraggingIndices([]);
    setOverId(null);
  };

  const assignRows = (categoryId: string, indices: number[]) => {
    indices.forEach(i => updateRowCategory(i, categoryId));

    const assignedNames = new Set(indices.map(i => rows[i].name).filter(Boolean));

    for (const name of assignedNames) {
      const matchingUnassigned = rows
        .map((r, i) => ({ r, i }))
        .filter(({ r, i }) => r.name === name && r.categoryId === null && !indices.includes(i))
        .map(({ i }) => i);

      if (matchingUnassigned.length > 0) {
        setBulkAssign({ name, indices: matchingUnassigned, categoryId });
        break;
      }
    }

    setDraggingIndices([]);
    setOverId(null);
  };

  const confirmBulkAssign = () => {
    if (!bulkAssign) {
      return;
    }

    bulkAssign.indices.forEach(i => updateRowCategory(i, bulkAssign.categoryId));
    setBulkAssign(null);
  };

  const handleRenameRow = (index: number, newName: string) => {
    const oldName = rows[index].name;

    updateRowName(index, newName);

    if (newName && newName !== oldName) {
      const matchingOthers = rows
        .map((r, i) => ({ r, i }))
        .filter(({ r, i }) => r.name === oldName && i !== index)
        .map(({ i }) => i);

      if (matchingOthers.length > 0) {
        setBulkRename({ oldName, newName, indices: matchingOthers });
      }
    }
  };

  const confirmBulkRename = () => {
    if (!bulkRename) {
      return;
    }

    bulkRename.indices.forEach(i => updateRowName(i, bulkRename.newName));
    setBulkRename(null);
  };

  return (
    <Column flex={1} minHeight={0} height="100%" spacing={2}>
      <Column spacing={0.5}>
        <Row justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.categorize.progress', { categorized: categorizedCount, total })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Row>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ borderRadius: 1, height: 6 }}
        />
      </Column>
      {isMobile ? (
        <MobileCategorizeView
          rows={rows}
          categories={expenseCategories}
          onAssign={assignRows}
          onRenameRow={handleRenameRow}
          bulkAssign={bulkAssign}
          onConfirmBulkAssign={confirmBulkAssign}
          onDismissBulkAssign={() => setBulkAssign(null)}
          bulkRename={bulkRename}
          onConfirmBulkRename={confirmBulkRename}
          onDismissBulkRename={() => setBulkRename(null)}
        />
      ) : (
        <>
          <Row flex={1} minHeight={0} spacing={2} alignItems="stretch">
            <TransactionPanel
              rows={rows}
              categories={expenseCategories}
              draggingIndices={draggingIndices}
              onToggleSelected={toggleRowSelected}
              onToggleAll={toggleAllSelected}
              onDragStart={startDragging}
              onDragEnd={stopDragging}
              onRenameRow={handleRenameRow}
            />
            <CategoryPanel
              categories={expenseCategories}
              rows={rows}
              draggingIndices={draggingIndices}
              overId={overId}
              onSetOverId={setOverId}
              onAssign={assignRows}
            />
          </Row>
          {bulkAssign && (
            <BulkAssignPrompt
              merchantName={bulkAssign.name}
              count={bulkAssign.indices.length}
              onConfirm={confirmBulkAssign}
              onDismiss={() => setBulkAssign(null)}
            />
          )}
          {bulkRename && (
            <BulkRenamePrompt
              oldName={bulkRename.oldName}
              newName={bulkRename.newName}
              count={bulkRename.indices.length}
              onConfirm={confirmBulkRename}
              onDismiss={() => setBulkRename(null)}
            />
          )}
        </>
      )}
    </Column>
  );
};

export default CategorizeStep;
