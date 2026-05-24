import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TESTIMONIAL_KEYS } from '@/pages/Home/TestimonialsSection/constants';
import TestimonialCard from '@/pages/Home/TestimonialsSection/TestimonialCard';

const DesktopGrid = () => {
  const { t } = useTranslation('home');

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'grid' },
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 3,
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
      }}
    >
      {TESTIMONIAL_KEYS.map(key => (
        <TestimonialCard
          key={key}
          quote={t(`landing.testimonials.items.${key}.quote`)}
          name={t(`landing.testimonials.items.${key}.name`)}
        />
      ))}
    </Box>
  );
};

export default DesktopGrid;
