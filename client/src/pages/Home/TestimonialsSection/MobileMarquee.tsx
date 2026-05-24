import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TESTIMONIAL_KEYS } from '@/pages/Home/TestimonialsSection/constants';
import {
  getMarqueeItemStyle,
  getMarqueeTrackStyle,
  getMarqueeViewportStyle,
} from '@/pages/Home/TestimonialsSection/styles';
import TestimonialCard from '@/pages/Home/TestimonialsSection/TestimonialCard';

const MARQUEE_SETS = [false, true];

const MobileMarquee = () => {
  const { t } = useTranslation('home');

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' }, ...getMarqueeViewportStyle() }}>
      <Box sx={getMarqueeTrackStyle()}>
        {MARQUEE_SETS.map(isDuplicate =>
          TESTIMONIAL_KEYS.map(key => (
            <Box
              key={`${isDuplicate ? 'dup' : 'orig'}-${key}`}
              aria-hidden={isDuplicate || undefined}
              sx={getMarqueeItemStyle(isDuplicate)}
            >
              <TestimonialCard
                quote={t(`landing.testimonials.items.${key}.quote`)}
                name={t(`landing.testimonials.items.${key}.name`)}
              />
            </Box>
          )),
        )}
      </Box>
    </Box>
  );
};

export default MobileMarquee;
