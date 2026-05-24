import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useAccounts } from '@/hooks/entities/useAccounts';
import { useImportWizard } from '@/pages/Import/ImportWizardContext';
import { getAccountDisplayName } from '@/utils/entities/account';

import AllDuplicatesScreen from './AllDuplicatesScreen';
import DuplicateRow, { DuplicateDecision } from './DuplicateRow';

const buildDecisions = (indices: number[], decision: DuplicateDecision) =>
  Object.fromEntries(indices.map(index => [index, decision])) as Record<number, DuplicateDecision>;

const DuplicateReviewPanel = () => {
  const { t } = useTranslation('transactions');
  const { t: tAccounts } = useTranslation('accounts');
  const {
    rows,
    preview,
    duplicateRowIndices,
    settings,
    deleteRows,
    goToNextStep,
    setIsReviewingDuplicates,
    setSkippedDuplicatesCount,
  } = useImportWizard();
  const { accounts } = useAccounts();

  const account = accounts.find(a => a._id === settings.accountId);
  const accountName = getAccountDisplayName(account, tAccounts);

  const [decisions, setDecisions] = useState<Record<number, DuplicateDecision>>(() =>
    buildDecisions(duplicateRowIndices, 'skip')
  );
  const [isClosed, setIsClosed] = useState(false);

  const setDecision = (index: number, decision: DuplicateDecision) => {
    setDecisions(prev => ({ ...prev, [index]: decision }));
  };

  const skippedCount = duplicateRowIndices.filter(index => decisions[index] === 'skip').length;
  const importingCount = rows.length - skippedCount;
  const isEmptyImport = importingCount === 0;

  const goBack = () => {
    setIsReviewingDuplicates(false);
  };

  const proceed = () => {
    if (isEmptyImport) {
      setIsClosed(true);

      return;
    }

    const skipped = duplicateRowIndices.filter(index => decisions[index] === 'skip');

    setSkippedDuplicatesCount(skipped.length);
    deleteRows(skipped);
    setIsReviewingDuplicates(false);
    goToNextStep();
  };

  if (isClosed) {
    const dateRange = settings.dateFilter ?? preview?.dateRange;

    return <AllDuplicatesScreen totalCount={rows.length} month={dateRange?.to?.slice(0, 7)} />;
  }

  return (
    <Column flex={1} minHeight={0} spacing={2}>
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Column spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            {t('importWizard.duplicates.title', { count: duplicateRowIndices.length })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.duplicates.subtitle')}
          </Typography>
        </Column>
      </Paper>

      <Row justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {t('importWizard.duplicates.skipSelectedCount', { count: skippedCount })}
        </Typography>
        <Row spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setDecisions(buildDecisions(duplicateRowIndices, 'skip'))}
          >
            {t('importWizard.duplicates.skipAll')}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setDecisions(buildDecisions(duplicateRowIndices, 'import'))}
          >
            {t('importWizard.duplicates.importAll')}
          </Button>
        </Row>
      </Row>

      {isEmptyImport && (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1.5, borderColor: 'warning.main' }}>
          <Row spacing={1} alignItems="center">
            <WarningAmberIcon sx={{ fontSize: 18, color: 'warning.main' }} />
            <Typography variant="body2" color="warning.main">
              {t('importWizard.duplicates.emptyBanner')}
            </Typography>
          </Row>
        </Paper>
      )}

      <Column spacing={1} flex={1} minHeight={0} sx={{ overflowY: 'auto' }}>
        {duplicateRowIndices.map(index => (
          <DuplicateRow
            key={index}
            row={rows[index]}
            accountName={accountName}
            decision={decisions[index] ?? 'skip'}
            onChange={decision => setDecision(index, decision)}
          />
        ))}
      </Column>

      <Row justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
        <Button variant="outlined" onClick={goBack}>
          {t('importWizard.navigation.back')}
        </Button>
        {!isEmptyImport && (
          <Typography variant="body2" color="text.secondary">
            {t('importWizard.duplicates.willImportCount', { count: importingCount })}
          </Typography>
        )}
        <Button variant="contained" onClick={proceed}>
          {isEmptyImport
            ? t('importWizard.duplicates.finishImport')
            : t('importWizard.duplicates.continue')}
        </Button>
      </Row>
    </Column>
  );
};

export default DuplicateReviewPanel;
