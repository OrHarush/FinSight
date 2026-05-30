import { Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import MockupFrame from '@/pages/Home/HowItWorksSection/MockupFrame';
import { HowItWorksStep } from '@/pages/Home/HowItWorksSection/types';

const ACCENT_PURPLE = '#a78bfa';

interface StepCardProps {
  step: HowItWorksStep;
  align?: 'center' | 'start';
}

const StepCard = ({ step, align = 'start' }: StepCardProps) => (
  <Column
    spacing={2}
    alignItems={align === 'center' ? 'center' : 'stretch'}
    sx={{ width: '100%', textAlign: align === 'center' ? 'center' : 'start' }}
  >
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: ACCENT_PURPLE,
        letterSpacing: '0.18em',
      }}
    >
      {step.number}
    </Typography>

    <MockupFrame>{step.mockup}</MockupFrame>

    <Column
      spacing={1}
      alignItems={align === 'center' ? 'center' : 'flex-start'}
      sx={{ minHeight: { xs: 128, md: 112 } }}
    >
      <Typography
        component="h3"
        variant="h5"
        sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.15rem' }}
      >
        {step.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.75,
          maxWidth: 320,
          whiteSpace: 'pre-line',
        }}
      >
        {step.description}
      </Typography>
    </Column>
  </Column>
);

export default StepCard;
