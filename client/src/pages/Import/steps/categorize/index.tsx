import { LinearProgress, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useCategories } from '@/hooks/entities/useCategories';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import BulkAssignPrompt from '@/pages/Import/steps/categorize/BulkAssignPrompt';
import BulkRenamePrompt from '@/pages/Import/steps/categorize/BulkRenamePrompt';
import CardStepHeader from '@/pages/Import/steps/categorize/CardStepHeader';
import CategoryPanel from '@/pages/Import/steps/categorize/CategoryPanel';
import MobileCategorizeView from '@/pages/Import/steps/categorize/MobileCategorizeView';
import TransactionPanel from '@/pages/Import/steps/categorize/TransactionPanel';
import { WizardRow } from '@/pages/Import/types/importWizard';

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
    deleteRows,
    setCanProceed,
    cards,
    activeCardIndex,
    setActiveCardIndex,
    registerNextIntercept,
    registerPrevIntercept,
    setNextLabelOverride,
  } = useImportWizard();
  const { categories, expenseCategories, incomeCategories } = useCategories();
  const isMobile = useIsSmallScreen();
  const [draggingIndices, setDraggingIndices] = useState<number[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const [bulkAssign, setBulkAssign] = useState<BulkAssignState | null>(null);
  const [bulkRename, setBulkRename] = useState<BulkRenameState | null>(null);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const isMultiCard = cards.length >= 2;
  const activeCardKey = isMultiCard ? cards[activeCardIndex] : null;

  const visibleGlobalIndices = useMemo(() => {
    if (!isMultiCard) {
      return rows.map((_, i) => i);
    }

    return rows.map((r, i) => (r.card === activeCardKey ? i : -1)).filter(i => i >= 0);
  }, [rows, isMultiCard, activeCardKey]);

  const visibleRows = useMemo(
    () => visibleGlobalIndices.map(globalIdx => rows[globalIdx]),
    [visibleGlobalIndices, rows]
  );

  const hasRefunds = visibleRows.some(r => r.amount < 0);
  const visibleCategories = activeTab === 'income' ? incomeCategories : expenseCategories;

  const categorizedCount = visibleRows.filter(r => r.categoryId !== null).length;
  const total = visibleRows.length;
  const progress = total > 0 ? (categorizedCount / total) * 100 : 0;

  useEffect(() => {
    setCanProceed(true);
    setBulkAssign(null);
    setBulkRename(null);
  }, [setCanProceed, activeCardIndex]);

  useEffect(() => {
    if (!isMultiCard) {
      registerNextIntercept(null);
      registerPrevIntercept(null);
      setNextLabelOverride(null);
      return;
    }

    registerNextIntercept(() => {
      if (activeCardIndex < cards.length - 1) {
        setActiveCardIndex(activeCardIndex + 1);
        return true;
      }

      return false;
    });

    registerPrevIntercept(() => {
      if (activeCardIndex > 0) {
        setActiveCardIndex(activeCardIndex - 1);
        return true;
      }

      return false;
    });

    setNextLabelOverride(
      activeCardIndex < cards.length - 1 ? t('importWizard.navigation.nextCard') : null
    );

    return () => {
      registerNextIntercept(null);
      registerPrevIntercept(null);
      setNextLabelOverride(null);
    };
  }, [
    isMultiCard,
    activeCardIndex,
    cards.length,
    registerNextIntercept,
    registerPrevIntercept,
    setActiveCardIndex,
    setNextLabelOverride,
    t,
  ]);

  const startDragging = (globalIdx: number) => {
    if (rows[globalIdx].selected) {
      setDraggingIndices(visibleGlobalIndices.filter(i => rows[i].selected));
    } else {
      setDraggingIndices([globalIdx]);
    }
  };

  const stopDragging = () => {
    setDraggingIndices([]);
    setOverId(null);
  };

  const inActiveCard = (row: WizardRow): boolean => !isMultiCard || row.card === activeCardKey;

  const assignRows = (categoryId: string, globalIndices: number[]) => {
    globalIndices.forEach(i => updateRowCategory(i, categoryId));

    const assignedNames = new Set(globalIndices.map(i => rows[i].name).filter(Boolean));

    for (const name of assignedNames) {
      const matchingUnassigned = rows
        .map((r, i) => ({ r, i }))
        .filter(
          ({ r, i }) =>
            r.name === name &&
            r.categoryId === null &&
            !globalIndices.includes(i) &&
            inActiveCard(r)
        )
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

  const renameRow = (globalIdx: number, newName: string) => {
    const oldName = rows[globalIdx].name;

    updateRowName(globalIdx, newName);

    if (newName && newName !== oldName) {
      const matchingOthers = rows
        .map((r, i) => ({ r, i }))
        .filter(({ r, i }) => r.name === oldName && i !== globalIdx && inActiveCard(r))
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

  const toggleAllInActiveCard = () => {
    if (!isMultiCard) {
      toggleAllSelected();
      return;
    }

    const allSelected = visibleRows.every(r => r.selected);

    visibleGlobalIndices.forEach(i => {
      if (rows[i].selected !== !allSelected) {
        toggleRowSelected(i);
      }
    });
  };

  const handlePanelDeleteSelected = (localIndices: number[]) => {
    const globalIndices = localIndices.map(local => visibleGlobalIndices[local]);

    deleteRows(globalIndices);
  };

  const localToGlobal = (localIdx: number): number => visibleGlobalIndices[localIdx];

  return (
    <Column flex={1} minHeight={0} height="100%" spacing={2}>
      {isMultiCard && activeCardKey !== null && (
        <CardStepHeader
          cardKey={activeCardKey}
          currentIndex={activeCardIndex}
          totalCards={cards.length}
          rowCount={total}
        />
      )}
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
          rows={visibleRows}
          hasRefunds={hasRefunds}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAssign={(categoryId, localIndices) =>
            assignRows(categoryId, localIndices.map(localToGlobal))
          }
          onRenameRow={(localIdx, name) => renameRow(localToGlobal(localIdx), name)}
          onDeleteRows={handlePanelDeleteSelected}
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
              rows={visibleRows}
              categories={categories}
              activeTab={hasRefunds ? activeTab : undefined}
              onTabChange={hasRefunds ? setActiveTab : undefined}
              hasRefunds={hasRefunds}
              draggingIndices={draggingIndices
                .map(globalIdx => visibleGlobalIndices.indexOf(globalIdx))
                .filter(i => i >= 0)}
              onToggleSelected={localIdx => toggleRowSelected(localToGlobal(localIdx))}
              onToggleAll={toggleAllInActiveCard}
              onDragStart={localIdx => startDragging(localToGlobal(localIdx))}
              onDragEnd={stopDragging}
              onRenameRow={(localIdx, name) => renameRow(localToGlobal(localIdx), name)}
              onDeleteSelected={handlePanelDeleteSelected}
            />
            <CategoryPanel
              categories={visibleCategories}
              rows={visibleRows}
              draggingIndices={draggingIndices
                .map(globalIdx => visibleGlobalIndices.indexOf(globalIdx))
                .filter(i => i >= 0)}
              overId={overId}
              onSetOverId={setOverId}
              onAssign={(categoryId, localIndices) =>
                assignRows(categoryId, localIndices.map(localToGlobal))
              }
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
