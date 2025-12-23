import Column from '@/components/layout/Containers/Column';
import { FinancialHealthStatus, HEALTH_UI } from '@/utils/financialHealth';

interface OverallHealthIconProps {
  status: FinancialHealthStatus;
}

const OverallHealthIcon = ({ status }: OverallHealthIconProps) => {
  const { color, Icon } = HEALTH_UI[status];

  return (
    <Column
      sx={{
        width: 100,
        height: 100,
        borderRadius: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${color}22`,
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color, width: 48, height: 48 }} />
    </Column>
  );
};

export default OverallHealthIcon;
