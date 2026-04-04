import { LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useCategories } from '@/hooks/entities/useCategories';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import BulkAssignPrompt from '@/pages/Import/steps/categorize/BulkAssignPrompt';
import CategoryPanel from '@/pages/Import/steps/categorize/CategoryPanel';
import TransactionPanel from '@/pages/Import/steps/categorize/TransactionPanel';

interface BulkAssignState {
  name: string;
  indices: number[];
  categoryId: string;
}

const CategorizeStep = () => {
  const { t } = useTranslation('transactions');
  const { rows, toggleRowSelected, updateRowCategory, setCanProceed } = useImportWizard();
  const { categories } = useCategories();

  const [draggingIndices, setDraggingIndices] = useState<number[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const [bulkAssign, setBulkAssign] = useState<BulkAssignState | null>(null);

  useEffect(() => {
    setCanProceed(true);
  }, [setCanProceed]);

  const categorizedCount = rows.filter(r => r.categoryId !== null).length;
  const total = rows.length;
  const progress = total > 0 ? (categorizedCount / total) * 100 : 0;

  const handleDragStart = (index: number) => {
    if (rows[index].selected) {
      setDraggingIndices(rows.map((r, i) => (r.selected ? i : -1)).filter(i => i >= 0));
    } else {
      setDraggingIndices([index]);
    }
  };

  const handleDragEnd = () => {
    setDraggingIndices([]);
    setOverId(null);
  };

  const handleAssign = (categoryId: string, indices: number[]) => {
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
        <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1, height: 6 }} />
      </Column>

      <Row flex={1} minHeight={0} spacing={2} alignItems="stretch">
        <CategoryPanel
          categories={categories}
          rows={rows}
          draggingIndices={draggingIndices}
          overId={overId}
          onSetOverId={setOverId}
          onAssign={handleAssign}
        />
        <TransactionPanel
          rows={rows}
          categories={categories}
          draggingIndices={draggingIndices}
          onToggleSelected={toggleRowSelected}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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
    </Column>
  );
};

export default CategorizeStep;
