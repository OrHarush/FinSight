import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';

interface ConPoint {
  lead: string;
  body: string;
}

const ProsConsCards = () => {
  const { t } = useTranslation('riseupReview');
  const theme = useTheme();

  const pros = t('prosCons.pros', { returnObjects: true }) as unknown as string[];
  const cons = t('prosCons.cons', { returnObjects: true }) as unknown as ConPoint[];

  const green = theme.palette.success.main;
  const red = theme.palette.error.main;

  const getCardSx = (accent: string) => ({
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(accent, 0.4)}`,
    borderRadius: '16px',
    p: 2.5,
  });

  const markerSx = (accent: string) => ({
    fontSize: '0.95rem',
    fontWeight: 700,
    color: accent,
    lineHeight: 1.7,
    flexShrink: 0,
  });

  const itemTextSx = { fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.7 } as const;

  return (
    <ResponsiveRow spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
      <Column spacing={1.5} sx={getCardSx(green)}>
        <Row spacing={1} alignItems="center">
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: green, flexShrink: 0 }} />
          <Typography component="h2" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
            {t('prosCons.prosTitle')}
          </Typography>
        </Row>
        <Column spacing={1}>
          {pros.map(item => (
            <Row key={item} spacing={1} alignItems="flex-start">
              <Typography sx={markerSx(green)}>✓</Typography>
              <Typography sx={itemTextSx}>{item}</Typography>
            </Row>
          ))}
        </Column>
      </Column>

      <Column spacing={1.5} sx={getCardSx(red)}>
        <Row spacing={1} alignItems="center">
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: red, flexShrink: 0 }} />
          <Typography component="h2" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
            {t('prosCons.consTitle')}
          </Typography>
        </Row>
        <Column spacing={1}>
          {cons.map(point => (
            <Row key={point.lead} spacing={1} alignItems="flex-start">
              <Typography sx={markerSx(red)}>✗</Typography>
              <Typography sx={itemTextSx}>
                <Typography component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {point.lead}{' '}
                </Typography>
                {point.body}
              </Typography>
            </Row>
          ))}
        </Column>
      </Column>
    </ResponsiveRow>
  );
};

export default ProsConsCards;
