import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useCategories } from '@/hooks/entities/useCategories';
import { QUICK_ADD_CONFIG, QUICK_ADD_KEYS } from '@/pages/OnBoarding/contants';
import QuickAddButton from '@/pages/OnBoarding/QuickAddButton';
import { QuickAddPreset } from '@/pages/OnBoarding/types';
import { resolvePresetCategory } from '@/utils/entities/category';

interface QuickAddPanelProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const QuickAddPanel = ({ openWithPreset }: QuickAddPanelProps) => {
  const { t } = useTranslation('overview');
  const { categories } = useCategories();

  const resolvedPills = QUICK_ADD_KEYS.map(key => {
    const categoryId = resolvePresetCategory(key, categories);

    if (!categoryId) {
      return null;
    }

    const { type, amount } = QUICK_ADD_CONFIG[key];
    const name = t(`setup.quickChips.${key}`);

    return {
      key,
      label: name,
      amount: t(`setup.floatingCards.${key}.amount`),
      type,
      preset: { type, name, amount, category: categoryId } satisfies QuickAddPreset,
    };
  }).filter(<T,>(p: T | null): p is T => p !== null);

  if (resolvedPills.length === 0) {
    return null;
  }

  return (
    <Column spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }} width="100%">
      <Row spacing={0.5} alignItems={'center'}>
        <FlashOnIcon sx={{ fontSize: '16px', color: 'text.disabled' }} />
        <Typography variant="body1" color="text.disabled" fontWeight={500}>
          {t('setup.quickAddLabel')}
        </Typography>
      </Row>
      <Row flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {resolvedPills.map(pill => (
          <QuickAddButton
            key={pill.key}
            label={pill.label}
            amount={pill.amount}
            type={pill.type}
            onClick={() => openWithPreset(pill.preset)}
          />
        ))}
      </Row>
    </Column>
  );
};

export default QuickAddPanel;
