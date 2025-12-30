import Column from '@/components/shared/layout/containers/Column';
import { FinancialHealthStatus, HEALTH_UI } from '@/utils/financialHealth';

interface OverallHealthIconProps {
  status: FinancialHealthStatus;
}

const OverallHealthIcon = ({ status }: OverallHealthIconProps) => {
  const { color, Icon } = HEALTH_UI[status];

  return (
    <Column
      sx={{
        width: 80,
        height: 80,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${color}22`,
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color, width: 48, height: 48 }} />
    </Column>
  );
};

export default OverallHealthIcon;
