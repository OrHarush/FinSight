import { Box, Card, CardContent, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';
import type { GoalProjectionDto, GoalProjectionPoint } from '@/types/Goal';

interface ProjectionChartProps {
  projection: GoalProjectionDto;
  goalColor: string;
  targetAmount: number;
}

interface ChartRow {
  date: string;
  actual?: number;
  projected?: number;
}

const mergePointsByDate = (points: GoalProjectionPoint[]): ChartRow[] => {
  const byDate = new Map<string, ChartRow>();
  let lastActualValue: number | undefined;

  for (const point of points) {
    const row = byDate.get(point.date) ?? { date: point.date };

    if (point.type === 'actual') {
      row.actual = point.value;
      lastActualValue = point.value;
    } else {
      row.projected = point.value;
    }

    byDate.set(point.date, row);
  }

  const sorted = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  if (lastActualValue === undefined) {
    return sorted;
  }

  const firstProjectedIdx = sorted.findIndex(row => row.projected !== undefined);
  const needsBridge = firstProjectedIdx > 0 && sorted[firstProjectedIdx].actual === undefined;

  if (needsBridge) {
    sorted[firstProjectedIdx].actual = lastActualValue;
  }

  return sorted;
};

const formatTooltipValue = (value: unknown): string =>
  typeof value === 'number' ? `${formatGoalAmount(value)} ₪` : '';

const ProjectionChart = ({ projection, goalColor, targetAmount }: ProjectionChartProps) => {
  const { t } = useTranslation('goals');
  const data = useMemo(() => mergePointsByDate(projection.projectionPoints), [projection.projectionPoints]);

  if (data.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {t('chart.noData')}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          {t('chart.title')}
        </Typography>
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%" style={{ direction: 'ltr' }}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={value => formatGoalAmount(value as number)}
                width={64}
              />
              <Tooltip formatter={formatTooltipValue} labelStyle={{ direction: 'ltr' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                y={targetAmount}
                stroke="#888"
                strokeDasharray="4 4"
                label={{ value: t('chart.target'), position: 'right', fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name={t('chart.actual')}
                stroke={goalColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="projected"
                name={t('chart.projected')}
                stroke={goalColor}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectionChart;
