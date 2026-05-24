import { keyframes, type Theme } from '@mui/material';

import { getAnnotationCardStyle } from '@/pages/Home/DashboardClaritySection/styles';
import { MARQUEE_CARD_WIDTH } from '@/pages/Home/TestimonialsSection/constants';

const MARQUEE_ITEM_GAP = '16px';
const EDGE_FADE = 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)';

const drift = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const getTestimonialCardStyle = (theme: Theme) => ({
  ...getAnnotationCardStyle(theme),
  height: '100%',
  p: 2.75,
});

export const getQuoteIconStyle = (theme: Theme) => ({
  color: theme.palette.primary.main,
  fontSize: '2rem',
});

export const getMarqueeViewportStyle = () => ({
  width: '100%',
  overflow: 'hidden',
  maskImage: EDGE_FADE,
  WebkitMaskImage: EDGE_FADE,
  '@media (prefers-reduced-motion: reduce)': {
    overflowX: 'auto',
    maskImage: 'none',
    WebkitMaskImage: 'none',
  },
});

export const getMarqueeTrackStyle = () => ({
  display: 'flex',
  width: 'max-content',
  animation: `${drift} 24s linear infinite`,
  '&:hover, &:active': {
    animationPlayState: 'paused',
  },
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});

export const getMarqueeItemStyle = (isDuplicate: boolean) => ({
  width: MARQUEE_CARD_WIDTH,
  flexShrink: 0,
  marginInlineEnd: MARQUEE_ITEM_GAP,
  ...(isDuplicate && {
    '@media (prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  }),
});
