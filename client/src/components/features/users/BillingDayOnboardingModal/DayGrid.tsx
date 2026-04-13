import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DayGridProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

const DayGrid = ({ selectedDay, onSelectDay }: DayGridProps) => {
  const { i18n } = useTranslation();

  return (
    <ToggleButtonGroup
      value={selectedDay}
      exclusive
      onChange={(_, value) => {
        if (value !== null) {
          onSelectDay(value as number);
        }
      }}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1.25,
        direction: i18n.dir(),
        overflow: 'visible',
        paddingY: 2,
      }}
    >
      {DAYS.map(day => (
        <ToggleButton
          key={day}
          value={day}
          sx={{
            borderRadius: '8px !important',
            border: '1px solid',
            borderColor: 'divider',
            fontSize: '0.95rem',
            minWidth: '48px',
            padding: '10px 0',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          }}
        >
          {day}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default DayGrid;
