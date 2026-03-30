import { useTranslation } from 'react-i18next';

import { usePageHeader } from '@/components/shared/layout/PageHeaderContext';

const TransactionsHeader = () => {
  const { t } = useTranslation('transactions');

  usePageHeader(t('pageTitle'), true);

  return null;
};

export default TransactionsHeader;
