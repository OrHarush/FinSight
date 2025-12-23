import { Typography, alpha, useTheme, Box } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { SvgIconComponent } from '@mui/icons-material';

export interface OverviewMetricProps {
  icon: SvgIconComponent;
  value: string;
  label: string;
  color: 'success' | 'error' | 'warning' | 'info';
}

const OverviewMetric = ({ icon: Icon, value, label, color }: OverviewMetricProps) => {
  const theme = useTheme();

  return (
    <Row alignItems={'center'} spacing={1}>
      <Box
        sx={{
          borderRadius: '12px',
          minWidth: 40,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(theme.palette.text.primary, 0.06),
        }}
      >
        <Icon color={color} />
      </Box>
      <Column>
        <Typography fontWeight={600}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Column>
    </Row>
  );
};

export default OverviewMetric;
