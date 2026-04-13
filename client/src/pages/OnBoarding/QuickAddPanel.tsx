import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { QUICK_ADD_CONFIG, QUICK_ADD_KEYS } from '@/pages/OnBoarding/contants';
import QuickAddButton from '@/pages/OnBoarding/QuickAddButton';
import { QuickAddPreset } from '@/pages/OnBoarding/types';

interface QuickAddPanelProps {
  openWithKey: (key: string, base: Omit<QuickAddPreset, 'category'>) => void;
}

const QuickAddPanel = ({ openWithKey }: QuickAddPanelProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }} width="100%">
      <Row spacing={0.5} alignItems={'center'}>
        <FlashOnIcon sx={{ fontSize: '16px', color: 'text.disabled' }} />
        <Typography variant="body1" color="text.disabled" fontWeight={500}>
          {t('setup.quickAddLabel')}
        </Typography>
      </Row>
      <Row flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {QUICK_ADD_KEYS.map(key => {
          const { type, amount } = QUICK_ADD_CONFIG[key];

          return (
            <QuickAddButton
              key={key}
              label={t(`setup.quickChips.${key}`)}
              amount={t(`setup.floatingCards.${key}.amount`)}
              type={type}
              onClick={() => openWithKey(key, { type, name: t(`setup.quickChips.${key}`), amount })}
            />
          );
        })}
      </Row>
    </Column>
  );
};

export default QuickAddPanel;
