import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { QUICK_ADD_CONFIG, QUICK_ADD_KEYS } from '@/pages/Overview/SetupPanel/contants';
import QuickAddButton from '@/pages/Overview/SetupPanel/QuickAddButton';
import { QuickAddPreset } from '@/pages/Overview/SetupPanel/types';

interface QuickAddPanelProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const QuickAddPanel = ({ openWithPreset }: QuickAddPanelProps) => {
  const { t } = useTranslation('overview');

  return (
    <Column spacing={1} alignItems={{ xs: 'center', sm: 'flex-start' }} width="100%">
      <Typography variant="caption" color="text.disabled" fontWeight={500}>
        {t('setup.quickAddLabel')}
      </Typography>
      <Row flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {QUICK_ADD_KEYS.map(key => {
          const { type, amount } = QUICK_ADD_CONFIG[key];

          return (
            <QuickAddButton
              key={key}
              label={t(`setup.quickChips.${key}`)}
              amount={t(`setup.floatingCards.${key}.amount`)}
              type={type}
              onClick={() => openWithPreset({ type, name: t(`setup.quickChips.${key}`), amount })}
            />
          );
        })}
      </Row>
    </Column>
  );
};

export default QuickAddPanel;
