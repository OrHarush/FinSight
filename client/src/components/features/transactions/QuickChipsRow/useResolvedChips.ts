import type { QuickChipDto } from '@lyra/shared';
import { useMemo } from 'react';

import { useIsSmallScreen } from '@/hooks/common/useIsSmallScreen';
import { useCategories } from '@/hooks/entities/useCategories';
import { useQuickChips } from '@/hooks/entities/useQuickChips';

const DESKTOP_CAP = 4;
const MOBILE_CAP = 5;

export const useResolvedChips = (enabled: boolean) => {
  const { categories } = useCategories();
  const { chips, isLoading, isError } = useQuickChips(enabled);
  const isSmallScreen = useIsSmallScreen();

  const resolved: QuickChipDto[] = useMemo(() => {
    const knownCategoryIds = new Set(categories.map(c => c._id));
    const filtered = chips.filter(chip => knownCategoryIds.has(chip.categoryId));
    const cap = isSmallScreen ? MOBILE_CAP : DESKTOP_CAP;

    return filtered.slice(0, cap);
  }, [chips, categories, isSmallScreen]);

  const skeletonCount = isSmallScreen ? MOBILE_CAP : DESKTOP_CAP;

  return { chips: resolved, isLoading, isError, skeletonCount };
};
