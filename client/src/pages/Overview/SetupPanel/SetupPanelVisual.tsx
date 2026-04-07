import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LyraPulseIcon from '@/components/shared/feedback/LyraPulseIcon';

import QuickAddButton from './QuickAddButton';
import { getFloatingCardWrapperStyle, getVisualOuterStyle } from './styles';
import { QuickAddPreset } from './types';

interface FloatingCardConfig {
  key: string;
  type: 'Income' | 'Expense';
  amount: number;
  positionSx: Record<string, unknown>;
  delay: number;
}

const FLOATING_CARDS: FloatingCardConfig[] = [
  {
    key: 'salary',
    type: 'Income',
    amount: 8500,
    positionSx: { top: 8, right: 8 },
    delay: 0,
  },
  {
    key: 'coffee',
    type: 'Expense',
    amount: 14,
    positionSx: { top: '50%', left: 8, transform: 'translateY(-50%)' },
    delay: 0.9,
  },
  {
    key: 'bit',
    type: 'Expense',
    amount: 200,
    positionSx: { bottom: 8, left: 24 },
    delay: 1.8,
  },
];

interface Props {
  onCardClick: (preset: QuickAddPreset) => void;
}

const SetupPanelVisual = ({ onCardClick }: Props) => {
  const { t } = useTranslation('overview');

  return (
    <Box sx={getVisualOuterStyle()}>
      <LyraPulseIcon
        size={160}
        iconSx={{ width: { xs: 68, sm: 84 }, height: { xs: 68, sm: 84 } }}
      />

      {FLOATING_CARDS.map(({ key, type, amount, positionSx, delay }) => (
        <Box key={key} sx={{ ...getFloatingCardWrapperStyle(delay), ...positionSx }}>
          <QuickAddButton
            label={t(`setup.floatingCards.${key}.label`)}
            amount={t(`setup.floatingCards.${key}.amount`)}
            type={type}
            onClick={() =>
              onCardClick({ type, name: t(`setup.floatingCards.${key}.label`), amount })
            }
          />
        </Box>
      ))}
    </Box>
  );
};

export default SetupPanelVisual;
