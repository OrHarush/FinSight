import { Card, CardContent, Grid, Tabs, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import Column from '@/components/layout/Containers/Column';
import YearlyChartContent from '@/pages/Dashboard/YearlyChart/YearlyChartContent';
import AccountBalanceChart from '@/pages/Dashboard/YearlyChart/AccountBalanceChart';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/hooks/useAccounts';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

const DashboardCharts = () => {
  const { t } = useTranslation('dashboard');
  // const { year } = useDashboardFilters();
  const { accounts } = useAccounts();
  const [tab, setTab] = useState(0);

  const primaryAccount = accounts.find(account => account.isPrimary);
  if (!primaryAccount) return null;

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ width: '100%', paddingBottom: 0 }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            minHeight: 50,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 50,
              py: 0.5,
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            label={t('chartTabs.yearlySummary') || 'Yearly Summary'}
            icon={<BarChartRoundedIcon />}
            sx={{ flexDirection: 'row', gap: 1 }}
          />
          <Tab
            label={t('chartTabs.accountBalance') || 'Account Balance'}
            icon={<TimelineRoundedIcon />}
            sx={{
              flexDirection: 'row',
              gap: 1,
            }}
          />
        </Tabs>
        <CardContent
          sx={{
            padding: 1,
            paddingBottom: '0 !important',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Column width="100%" height="330px">
            {tab === 0 ? (
              <YearlyChartContent />
            ) : (
              <AccountBalanceChart accountId={primaryAccount._id} />
            )}
          </Column>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DashboardCharts;
