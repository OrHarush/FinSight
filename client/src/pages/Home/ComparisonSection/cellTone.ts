import { Theme } from '@mui/material';

import { CellTone } from '@/pages/Home/ComparisonSection/types';

const BRAND_PURPLE = '#a78bfa';
const POSITIVE_TEAL = '#34d399';
const NEGATIVE_CORAL = '#f87171';

export const getCellToneColor = (tone: CellTone, theme: Theme) => {
  if (tone === 'brand') {
    return BRAND_PURPLE;
  }

  if (tone === 'positive') {
    return POSITIVE_TEAL;
  }

  if (tone === 'negative') {
    return NEGATIVE_CORAL;
  }

  return theme.palette.text.secondary;
};
