import Row from '@/components/shared/layout/containers/Row';
import AppearanceSettings from '@/components/shared/layout/NavBar/AppearanceSettings';
import { usePageHeaderContext } from '@/components/shared/layout/PageHeaderContext';
import MonthDateSelector from '@/components/shared/ui/MonthDateSelector';

const Controls = () => {
  const { showDateSelector, dateConfig } = usePageHeaderContext();

  return (
    <Row spacing={2} sx={{ marginInlineStart: 'auto' }}>
      {showDateSelector && dateConfig && (
        <MonthDateSelector value={dateConfig.value} onChange={dateConfig.onChange} />
      )}
      <AppearanceSettings />
    </Row>
  );
};

export default Controls;
