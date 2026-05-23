import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const FormulaAnswer = () => {
  const { t } = useTranslation('home');

  return (
    <Column spacing={1.5}>
      <Column spacing={0.25}>
        <Row spacing={0.75} alignItems="center">
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.secondary' }}>
            {t('landing.clarity.cards.why.naive.formula')}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'text.secondary' }}>
            ✗
          </Typography>
        </Row>
        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'text.secondary' }}>
          {t('landing.clarity.cards.why.naive.caption')}
        </Typography>
      </Column>

      <Column spacing={0.25}>
        <Row spacing={0.75} alignItems="center">
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'primary.main' }}>
            {t('landing.clarity.cards.why.lyra.formula')}
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'primary.main' }}>
            ✓
          </Typography>
        </Row>
        <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'text.secondary' }}>
          {t('landing.clarity.cards.why.lyra.caption')}
        </Typography>
      </Column>
    </Column>
  );
};

export default FormulaAnswer;
