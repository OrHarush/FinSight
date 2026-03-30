import { useTranslation } from 'react-i18next';

import { useNavBarDate, usePageHeader } from '@/components/shared/layout/PageHeaderContext';
import { useOverviewFilters } from '@/pages/Overview/OverviewFiltersProvider';

const OverviewHeader = () => {
  const { t } = useTranslation('overview');
  const { date, setDate } = useOverviewFilters();

  usePageHeader(t('pageTitle'), true);
  useNavBarDate(date, setDate);

  return null;
};

export default OverviewHeader;
