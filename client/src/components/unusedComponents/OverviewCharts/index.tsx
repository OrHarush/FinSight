import { Card, CardContent, Grid, Tabs, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';

const OverviewCharts = () => {
  const { t } = useTranslation('overview');
  const [tab, setTab] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Card sx={{ width: '100%', height: '100%', paddingBottom: 0 }}>
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
            height: '100%',
          }}
        ></CardContent>
      </Card>
    </Grid>
  );
};

export default OverviewCharts;
