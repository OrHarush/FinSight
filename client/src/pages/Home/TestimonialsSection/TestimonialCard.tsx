import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Divider, Typography, useTheme } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import {
  getQuoteIconStyle,
  getTestimonialCardStyle,
} from '@/pages/Home/TestimonialsSection/styles';

interface TestimonialCardProps {
  quote: string;
  name: string;
}

const TestimonialCard = ({ quote, name }: TestimonialCardProps) => {
  const theme = useTheme();

  return (
    <Column spacing={1.75} sx={getTestimonialCardStyle(theme)}>
      <FormatQuoteIcon aria-hidden="true" sx={getQuoteIconStyle(theme)} />

      <Typography sx={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.7, color: 'text.primary' }}>
        {quote}
      </Typography>

      <Divider sx={{ borderColor: 'divider' }} />

      <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.primary' }}>
        {name}
      </Typography>
    </Column>
  );
};

export default TestimonialCard;
