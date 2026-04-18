import { Typography, alpha, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface DashboardMetricProps {
  icon: ReactNode;
  iconColor: string;
  value: string;
  label: string;
  valueColor?: string;
}

const DashboardMetric = ({ icon, iconColor, value, label, valueColor }: DashboardMetricProps) => {
  const theme = useTheme();

  return (
    <Row alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
      <Column
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 32,
          height: 32,
          minWidth: 32,
          borderRadius: 1.5,
          backgroundColor: alpha(theme.palette.text.primary, 0.06),
          color: iconColor,
          '& svg': { fontSize: 18 },
        }}
      >
        {icon}
      </Column>
      <Column spacing={0} sx={{ minWidth: 0 }}>
        <Typography
          dir="ltr"
          sx={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: valueColor ?? theme.palette.text.primary,
            lineHeight: 1.2,
          }}
          noWrap
        >
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', lineHeight: 1.2 }}>
          {label}
        </Typography>
      </Column>
    </Row>
  );
};

export default DashboardMetric;
