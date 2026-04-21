import type { QuickChipDto } from '@lyra/shared';
import { TransactionFormValues } from '@lyra/shared';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

interface TrackerArgs {
  chips: QuickChipDto[];
  activeChipId: string | null;
  setActiveChipId: (id: string | null) => void;
  resolveLabel: (chip: QuickChipDto) => string;
}

export const useActiveChipTracker = ({
  chips,
  activeChipId,
  setActiveChipId,
  resolveLabel,
}: TrackerArgs) => {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const watchedAmount = useWatch({ control, name: 'amount' });
  const watchedName = useWatch({ control, name: 'name' });
  const watchedCategory = useWatch({ control, name: 'category' });
  const watchedPaymentMethod = useWatch({ control, name: 'paymentMethod' });

  const activeChip = activeChipId ? chips.find(c => c.id === activeChipId) ?? null : null;

  useEffect(() => {
    if (!activeChip) {
      return;
    }

    const matches =
      watchedAmount === activeChip.amount &&
      watchedName === resolveLabel(activeChip) &&
      watchedCategory === activeChip.categoryId &&
      watchedPaymentMethod === activeChip.paymentMethodId;

    if (!matches) {
      setActiveChipId(null);
    }
  }, [
    activeChip,
    watchedAmount,
    watchedName,
    watchedCategory,
    watchedPaymentMethod,
    setActiveChipId,
    resolveLabel,
  ]);

  const applyChip = (chipId: string) => {
    const chip = chips.find(c => c.id === chipId);

    if (!chip) {
      return;
    }

    setActiveChipId(chip.id);
    setValue('amount', chip.amount, { shouldDirty: true, shouldValidate: true });
    setValue('name', resolveLabel(chip), { shouldDirty: true, shouldValidate: true });
    setValue('category', chip.categoryId, { shouldDirty: true, shouldValidate: true });
    setValue('paymentMethod', chip.paymentMethodId, { shouldDirty: true, shouldValidate: true });
  };

  return { applyChip };
};
