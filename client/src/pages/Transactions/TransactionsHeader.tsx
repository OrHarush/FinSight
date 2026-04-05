import { useTranslation } from 'react-i18next';

import {
  useNavBarImportButton,
  usePageHeader,
} from '@/components/shared/layout/PageHeaderContext';

const TransactionsHeader = () => {
  const { t } = useTranslation('transactions');

  usePageHeader(t('pageTitle'), true);
  useNavBarImportButton();

  return null;
};

export default TransactionsHeader;
