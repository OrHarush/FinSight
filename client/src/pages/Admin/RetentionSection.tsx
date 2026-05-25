import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { RetentionCohortDto } from '@/types/Admin';

import { formatRetentionRate } from './formatRetentionRate';
import RetentionTableSkeleton from './RetentionTableSkeleton';
import { useRetention } from './useRetention';
import { getWeekRangeParts } from './weekRange';

const sortNewestFirst = (cohorts: RetentionCohortDto[]): RetentionCohortDto[] =>
  [...cohorts].sort((a, b) => b.weekStart.localeCompare(a.weekStart));

const RetentionSection = () => {
  const { t, i18n } = useTranslation('admin');
  const { data, isLoading, isError, refetch } = useRetention();

  const locale = i18n.language.startsWith('he') ? 'he' : 'en';

  const formatWeek = (cohort: RetentionCohortDto): string => {
    const parts = getWeekRangeParts(cohort.weekStart, cohort.weekEnd, locale);

    if (parts.sameMonth) {
      return t('retention.weekRange', {
        startDay: parts.startDay,
        endDay: parts.endDay,
        month: parts.endMonth,
      });
    }

    return t('retention.weekRangeCrossMonth', {
      startDay: parts.startDay,
      startMonth: parts.startMonth,
      endDay: parts.endDay,
      endMonth: parts.endMonth,
    });
  };

  if (isLoading) {
    return <RetentionTableSkeleton />;
  }

  if (isError) {
    return (
      <Column spacing={1.5} alignItems="flex-start" sx={{ py: 2 }}>
        <Typography variant="body2" color="error">
          {t('retention.error')}
        </Typography>
        <Button size="small" variant="outlined" onClick={() => refetch()}>
          {t('retention.retry')}
        </Button>
      </Column>
    );
  }

  if (!data || data.cohorts.length === 0) {
    return (
      <Column alignItems="center" sx={{ py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('retention.empty')}
        </Typography>
      </Column>
    );
  }

  const cohorts = sortNewestFirst(data.cohorts);

  return (
    <Column spacing={1.5}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('retention.weekColumn')}</TableCell>
              <TableCell align="center">{t('retention.signups')}</TableCell>
              <TableCell align="center">{t('retention.d1')}</TableCell>
              <TableCell align="center">{t('retention.d7')}</TableCell>
              <TableCell align="center">{t('retention.activated')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cohorts.map(cohort => (
              <TableRow key={cohort.weekStart} hover>
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>{formatWeek(cohort)}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{cohort.signups}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13 }}>
                    {formatRetentionRate(cohort.d1Rate)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13 }}>
                    {formatRetentionRate(cohort.d7Rate)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontSize: 13 }}>
                    {formatRetentionRate(cohort.activatedRate)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data.totals.pendingD7Count > 0 && (
        <Typography variant="caption" color="text.secondary">
          {t('retention.pendingD7', { count: data.totals.pendingD7Count })}
        </Typography>
      )}
    </Column>
  );
};

export default RetentionSection;
