import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import Row from '@/components/shared/layout/containers/Row';

interface MethodCard {
  title: string;
  description: string;
  suitableFor: string;
  drawback: string;
}

const MethodCards = () => {
  const { t } = useTranslation('cashflowGuide');
  const theme = useTheme();

  const cards = t('methodCards', { returnObjects: true }) as unknown as MethodCard[];
  const green = theme.palette.success.main;
  const red = theme.palette.error.main;

  const cardSx = {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '16px',
    p: 2.5,
  };

  const tagSx = (color: string) => ({
    px: 1,
    py: 0.25,
    borderRadius: '4px',
    backgroundColor: alpha(color, 0.15),
    flexShrink: 0,
  });

  const tagLabelSx = (color: string) => ({
    fontSize: '0.72rem',
    fontWeight: 700,
    color,
    lineHeight: 1.5,
  });

  const tagBodySx = {
    fontSize: '0.88rem',
    color: 'text.secondary',
    lineHeight: 1.7,
  } as const;

  const renderCard = (card: MethodCard) => (
    <Column key={card.title} spacing={1.5} sx={cardSx}>
      <Typography component="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary' }}>
        {card.title}
      </Typography>
      <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', lineHeight: 1.7 }}>
        {card.description}
      </Typography>
      <Row spacing={1} alignItems="flex-start">
        <Box sx={tagSx(green)}>
          <Typography sx={tagLabelSx(green)}>מתאים ל</Typography>
        </Box>
        <Typography sx={tagBodySx}>{card.suitableFor}</Typography>
      </Row>
      <Row spacing={1} alignItems="flex-start">
        <Box sx={tagSx(red)}>
          <Typography sx={tagLabelSx(red)}>החיסרון</Typography>
        </Box>
        <Typography sx={tagBodySx}>{card.drawback}</Typography>
      </Row>
    </Column>
  );

  return (
    <Column spacing={2} sx={{ width: '100%' }}>
      <ResponsiveRow spacing={2} alignItems="stretch">
        {renderCard(cards[0])}
        {renderCard(cards[1])}
      </ResponsiveRow>
      <ResponsiveRow spacing={2} alignItems="stretch">
        {renderCard(cards[2])}
        {renderCard(cards[3])}
      </ResponsiveRow>
    </Column>
  );
};

export default MethodCards;
