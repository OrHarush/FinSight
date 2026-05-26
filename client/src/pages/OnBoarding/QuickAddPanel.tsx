import AddIcon from '@mui/icons-material/Add';
import { alpha, Box, Button, ButtonBase, Theme, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useCategories } from '@/hooks/entities/useCategories';
import { RECURRING_CHIP_CONFIG, RECURRING_CHIP_KEYS, RecurringChipKey } from '@/pages/OnBoarding/contants';
import { QuickAddPreset } from '@/pages/OnBoarding/types';
import { resolvePresetCategory } from '@/utils/entities/category';

interface QuickAddPanelProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const getRecurringChipSx = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: 4,
  bgcolor: alpha(theme.palette.primary.main, 0.12),
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.3),
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'border-color 0.2s, background-color 0.2s',
  '&:hover': {
    bgcolor: alpha(theme.palette.primary.main, 0.2),
  },
});

const MOBILE_ROW_BREAK_AFTER = 2;

const QuickAddPanel = ({ openWithPreset }: QuickAddPanelProps) => {
  const { t } = useTranslation('overview');
  const { categories } = useCategories();

  const openRecurringChip = (key: RecurringChipKey) => {
    const { type } = RECURRING_CHIP_CONFIG[key];
    const name = t(`setup.recurringChips.${key}`);
    const category = resolvePresetCategory(key, categories);

    openWithPreset({ type, name, recurrence: 'Monthly', ...(category && { category }) });
  };

  const openBlankRecurring = () => {
    openWithPreset({ type: 'Expense', name: '', recurrence: 'Monthly' });
  };

  return (
    <Column spacing={2.5} alignItems={{ xs: 'center', sm: 'flex-start' }} width="100%">
      <Row flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {RECURRING_CHIP_KEYS.map((key, i) => (
          <Fragment key={key}>
            <ButtonBase onClick={() => openRecurringChip(key)} sx={getRecurringChipSx}>
              <AddIcon sx={{ fontSize: 14, color: 'primary.main', flexShrink: 0 }} />
              <Typography component="span" variant="body2" fontWeight={500} color="primary.main" lineHeight={1}>
                {t(`setup.recurringChips.${key}`)}
              </Typography>
            </ButtonBase>
            {i === MOBILE_ROW_BREAK_AFTER && (
              <Box sx={{ width: '100%', display: { xs: 'block', sm: 'none' } }} />
            )}
          </Fragment>
        ))}
      </Row>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openBlankRecurring}
        sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: '1rem', py: 1.25, px: 3 }}
      >
        {t('setup.addRecurring')}
      </Button>
    </Column>
  );
};

export default QuickAddPanel;
