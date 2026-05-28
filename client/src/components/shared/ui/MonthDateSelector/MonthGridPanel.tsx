import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, IconButton, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import Row from '@/components/shared/layout/containers/Row';
import { useMonthLabels } from '@/hooks/common/useMonthsLabels';

interface MonthGridPanelProps {
  value: Dayjs;
  minYear: number;
  maxYear: number;
  onSelect: (year: number, monthIndex: number) => void;
}

const flipIconForRtl = (theme: Theme) =>
  theme.direction === 'rtl' ? 'scaleX(-1)' : 'none';

const MonthGridPanel = ({ value, minYear, maxYear, onSelect }: MonthGridPanelProps) => {
  const monthLabels = useMonthLabels();
  const [panelYear, setPanelYear] = useState(value.year());

  useEffect(() => {
    setPanelYear(value.year());
  }, [value.year()]);

  const stepYearBack = () => setPanelYear(y => y - 1);
  const stepYearForward = () => setPanelYear(y => y + 1);

  const isYearBackDisabled = panelYear <= minYear;
  const isYearForwardDisabled = panelYear >= maxYear;

  return (
    <Box sx={{ width: 280, p: 1.5 }}>
      <Row alignItems="center" justifyContent="space-between" sx={{ px: 1, pb: 1 }}>
        <IconButton
          onClick={stepYearBack}
          size="small"
          color="primary"
          disabled={isYearBackDisabled}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ transform: flipIconForRtl }} />
        </IconButton>
        <Typography variant="body1" fontWeight={700}>
          {panelYear}
        </Typography>
        <IconButton
          onClick={stepYearForward}
          size="small"
          color="primary"
          disabled={isYearForwardDisabled}
        >
          <ArrowForwardIosIcon fontSize="small" sx={{ transform: flipIconForRtl }} />
        </IconButton>
      </Row>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          pt: 1.5,
        }}
      >
        {monthLabels.map((label, monthIndex) => {
          const isSelected = value.year() === panelYear && value.month() === monthIndex;

          return (
            <Button
              key={label}
              variant={isSelected ? 'outlined' : 'text'}
              onClick={() => onSelect(panelYear, monthIndex)}
              sx={{
                minWidth: 0,
                py: 1.25,
                fontWeight: 600,
                color: 'text.primary',
                ...(isSelected && { borderColor: 'primary.main' }),
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default MonthGridPanel;
