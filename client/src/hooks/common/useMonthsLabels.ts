import { useTranslation } from 'react-i18next';

export const useMonthLabels = (): string[] => {
  const { t } = useTranslation('common');

  return [
    t('months.jan'),
    t('months.feb'),
    t('months.mar'),
    t('months.apr'),
    t('months.may'),
    t('months.jun'),
    t('months.jul'),
    t('months.aug'),
    t('months.sep'),
    t('months.oct'),
    t('months.nov'),
    t('months.dec'),
  ];
};
