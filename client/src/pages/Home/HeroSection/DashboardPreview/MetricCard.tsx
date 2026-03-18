import Column from '@/components/shared/layout/containers/Column';
import { alpha, useTheme } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Typography from '@mui/material/Typography';

const MetricCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => {
  const theme = useTheme();

  return (
    <Column
      spacing={0.4}
      alignItems="center"
      sx={{
        px: 1.75,
        py: 1.25,
        borderRadius: 2.5,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        flex: 1,
        minWidth: 80,
      }}
    >
      <Row alignItems="center" spacing={0.5} sx={{ color }}>
        {icon}
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.68rem' }}
        >
          {label}
        </Typography>
      </Row>
      <Typography variant="body2" sx={{ fontWeight: 700, color, fontSize: '0.85rem' }}>
        {value}
      </Typography>
    </Column>
  );
};

export default MetricCard;
