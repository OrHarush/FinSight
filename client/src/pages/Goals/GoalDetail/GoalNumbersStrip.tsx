import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';

interface GoalNumbersStripProps {
  current: number;
  target: number;
  monthly: number;
}

const GoalNumbersStrip = ({ current, target, monthly }: GoalNumbersStripProps) => {
  const { t } = useTranslation('goals');

  const cells = [
    { label: t('numbers.current'), value: current },
    { label: t('numbers.target'), value: target },
    { label: t('numbers.monthly'), value: monthly },
  ];

  return (
    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}>
      <Row spacing={2} alignItems="flex-start">
        {cells.map(cell => (
          <Column key={cell.label} spacing={0.25} flex={1}>
            <Typography variant="caption" color="text.secondary">
              {cell.label}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {formatGoalAmount(cell.value)} ₪
            </Typography>
          </Column>
        ))}
      </Row>
    </Box>
  );
};

export default GoalNumbersStrip;
