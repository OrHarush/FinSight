import type { QuickChipDto } from '@lyra/shared';
import { TransactionFormValues } from '@lyra/shared';
import { Typography } from '@mui/material';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import QuickChip from '@/components/shared/ui/QuickChip';

import QuickChipsSkeleton from './QuickChipsSkeleton';
import { getLabelStyle, getScrollRowStyle } from './styles';
import { useActiveChipTracker } from './useActiveChipTracker';
import { useEdgeFadeMask } from './useEdgeFadeMask';
import { useResolvedChips } from './useResolvedChips';

interface QuickChipsRowProps {
  activeChipId: string | null;
  setActiveChipId: (id: string | null) => void;
}

const QuickChipsRow = ({ activeChipId, setActiveChipId }: QuickChipsRowProps) => {
  const { t, i18n } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();
  const transactionType = useWatch({ control, name: 'type' });
  const isExpense = transactionType === 'Expense';
  const isRtl = i18n.language === 'he';

  const { chips, isLoading, isError, skeletonCount } = useResolvedChips(isExpense);
  const { ref, mask } = useEdgeFadeMask(chips.length + (isLoading ? 1 : 0));

  const resolveLabel = useCallback(
    (chip: QuickChipDto) =>
      chip.isSeed ? t(`quickChips.seed.${chip.seedKey}`, { defaultValue: chip.name }) : chip.name,
    [t]
  );

  const { applyChip } = useActiveChipTracker({
    chips,
    activeChipId,
    setActiveChipId,
    resolveLabel,
  });

  if (!isExpense || isError) {
    return null;
  }

  if (!isLoading && chips.length === 0) {
    return null;
  }

  return (
    <Column spacing={0.75}>
      <Typography variant="caption" color="text.secondary" sx={getLabelStyle()}>
        {t('quickChips.label')}
      </Typography>
      <Row ref={ref} spacing={1} sx={getScrollRowStyle({ ...mask, isRtl })}>
        {isLoading && <QuickChipsSkeleton count={skeletonCount} />}
        {!isLoading &&
          chips.map(chip => (
            <QuickChip
              key={chip.id}
              label={resolveLabel(chip)}
              amount={chip.amount}
              isActive={activeChipId === chip.id}
              onClick={() => applyChip(chip.id)}
            />
          ))}
      </Row>
    </Column>
  );
};

export default QuickChipsRow;
