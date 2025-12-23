import { Typography } from '@mui/material';
import Column from '@/components/layout/Containers/Column';

interface HealthIndicatorCellProps {
  title: string;
  value: string;
  description?: string;
}

const HealthIndicatorCell = ({ title, value, description }: HealthIndicatorCellProps) => (
  <Column spacing={0.5}>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
    <Typography fontWeight={600}>{value}</Typography>
    {description && <Typography fontWeight={600}>{description}</Typography>}
  </Column>
);

export default HealthIndicatorCell;
