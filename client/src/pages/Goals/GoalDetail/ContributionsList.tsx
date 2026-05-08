import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatGoalAmount, formatLocalizedMonth } from '@/pages/Goals/utils/goalFormatters';

interface ContributionsListProps {
  contributionsByMonth: Array<{ month: string; amount: number }>;
  goalCategoryName: string;
}

const sortByMonthDescending = (entries: Array<{ month: string; amount: number }>) =>
  [...entries].sort((a, b) => b.month.localeCompare(a.month));

const formatSignedAmount = (amount: number): string =>
  `${amount >= 0 ? '+' : '-'}${formatGoalAmount(Math.abs(amount))} ₪`;

const ContributionsList = ({ contributionsByMonth, goalCategoryName }: ContributionsListProps) => {
  const { t, i18n } = useTranslation('goals');
  const sorted = useMemo(() => sortByMonthDescending(contributionsByMonth), [contributionsByMonth]);

  if (sorted.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            {t('contributions.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('contributions.empty', { name: goalCategoryName })}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          {t('contributions.title')}
        </Typography>
        <Column spacing={0}>
          {sorted.map((entry, idx) => (
            <Box key={entry.month}>
              <Row justifyContent="space-between" alignItems="center" sx={{ py: 1 }}>
                <Typography variant="body2">
                  {formatLocalizedMonth(`${entry.month}-01`, i18n.language)}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={entry.amount >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatSignedAmount(entry.amount)}
                </Typography>
              </Row>
              {idx < sorted.length - 1 && <Divider />}
            </Box>
          ))}
        </Column>
      </CardContent>
    </Card>
  );
};

export default ContributionsList;
