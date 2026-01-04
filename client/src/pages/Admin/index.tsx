import { Box, Typography, Grid } from '@mui/material';
import { TrendingUp, CalendarMonth } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import { KpiOverviewDto } from '@/types/Admin';
import { useFetch } from '@/hooks/useFetch';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import KpiSkeleton from '@/pages/Admin/KpiSkeleton';
import KpiCard from '@/pages/Admin/KpiCard';
import UserActivityList from '@/pages/Admin/UserActivityList';

export const AdminKpiDashboard = () => {
  const { data: kpiOverview, isLoading: isLoadingKpis } = useFetch<KpiOverviewDto>({
    url: `${API_ROUTES.ADMIN}/overview`,
    queryKey: queryKeys.kpis(),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Product Health
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Internal usage metrics
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          {isLoadingKpis || !kpiOverview ? (
            <KpiSkeleton />
          ) : (
            <KpiCard
              label="DAU"
              value={kpiOverview.dau}
              hint="Users who logged in today"
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
              label="Avg Logins (30d)"
              value={kpiOverview.avgLogins30d}
              hint="Average logins per user"
              icon={TrendingUp}
              color="success"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {isLoadingKpis || !kpiOverview ? (
            <KpiSkeleton />
          ) : (
            <KpiCard
              label="Active Users (7d)"
              value={kpiOverview.activeLast7dPercent}
              hint="Percentage of users active in the last 7 days"
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
