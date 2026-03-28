import CalendarMonth from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import KpiCard from '@/pages/Admin/KpiCard';
import KpiSkeleton from '@/pages/Admin/KpiSkeleton';
import UserActivityList from '@/pages/Admin/UserActivityList';
import { KpiOverviewDto } from '@/types/Admin';

export const AdminKpiDashboard = () => {
  const { t } = useTranslation('admin');

  const { data: kpiOverview, isLoading: isLoadingKpis } = useFetch<KpiOverviewDto>({
    url: `${API_ROUTES.ADMIN}/overview`,
    queryKey: queryKeys.kpis(),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          {isLoadingKpis || !kpiOverview ? (
            <KpiSkeleton />
          ) : (
            <KpiCard
              label={t('kpi.dau')}
              value={kpiOverview.dau}
              hint={t('kpi.dauHint')}
              icon={PeopleIcon}
              color="primary"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {isLoadingKpis || !kpiOverview ? (
            <KpiSkeleton />
          ) : (
            <KpiCard
              label={t('kpi.totalUsers')}
              value={kpiOverview.totalUsers}
              hint={t('kpi.totalUsersHint')}
              icon={GroupsIcon}
              color="success"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {isLoadingKpis || !kpiOverview ? (
            <KpiSkeleton />
          ) : (
            <KpiCard
              label={t('kpi.activeLast7d')}
              value={kpiOverview.activeLast7d}
              hint={t('kpi.activeLast7dHint')}
              icon={CalendarMonth}
              color="info"
            />
          )}
        </Grid>
      </Grid>

      <UserActivityList />
    </Box>
  );
};
