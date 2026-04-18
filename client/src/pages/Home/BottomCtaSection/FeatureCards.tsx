import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FeatureCard from '@/pages/Home/BottomCtaSection/FeatureCard';

const FeatureCards = () => {
  const { t } = useTranslation('home');

  const cards = [
    {
      key: 'feedback',
      icon: <ChatBubbleOutlineIcon />,
      title: t('bottomCta.cards.feedback.title'),
      description: t('bottomCta.cards.feedback.description'),
    },
    {
      key: 'israeli',
      icon: <CreditCardIcon />,
      title: t('bottomCta.cards.israeli.title'),
      description: t('bottomCta.cards.israeli.description'),
    },
    {
      key: 'fast',
      icon: <ScheduleIcon />,
      title: t('bottomCta.cards.fast.title'),
      description: t('bottomCta.cards.fast.description'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: { xs: 1.5, md: 2.5 },
        width: '100%',
        maxWidth: 840,
        mx: 'auto',
      }}
    >
      {cards.map(card => (
        <FeatureCard
          key={card.key}
          icon={card.icon}
          title={card.title}
          description={card.description}
        />
      ))}
    </Box>
  );
};

export default FeatureCards;
