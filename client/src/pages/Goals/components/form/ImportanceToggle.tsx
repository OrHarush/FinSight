import type { GoalImportanceValue } from '@lyra/shared';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ImportanceToggleProps {
  value: GoalImportanceValue;
  onChange: (value: GoalImportanceValue) => void;
}

const VALUES: GoalImportanceValue[] = ['low', 'medium', 'high'];

const PALETTE: Record<GoalImportanceValue, { bg: string; bgHover: string; fg: string }> = {
  low: { bg: '#bbdefb', bgHover: '#90caf9', fg: '#0d47a1' },
  medium: { bg: '#ffe0b2', bgHover: '#ffcc80', fg: '#e65100' },
  high: { bg: '#ffcdd2', bgHover: '#ef9a9a', fg: '#b71c1c' },
};

const getButtonStyle = (importance: GoalImportanceValue) => {
  const colors = PALETTE[importance];

  return {
    textTransform: 'none' as const,
    py: 0.75,
    fontWeight: 500,
    border: '1px solid',
    borderColor: 'divider',
    '&.Mui-selected': {
      backgroundColor: colors.bg,
      color: colors.fg,
      borderColor: colors.bg,
      fontWeight: 700,
      '&:hover': {
        backgroundColor: colors.bgHover,
      },
    },
  };
};

const ImportanceToggle = ({ value, onChange }: ImportanceToggleProps) => {
  const { t } = useTranslation('goals');

  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      size="small"
      value={value}
      onChange={(_, next) => {
        if (next) {
          onChange(next as GoalImportanceValue);
        }
      }}
    >
      {VALUES.map(v => (
        <ToggleButton key={v} value={v} sx={getButtonStyle(v)}>
          {t(`importance.${v}`)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ImportanceToggle;
