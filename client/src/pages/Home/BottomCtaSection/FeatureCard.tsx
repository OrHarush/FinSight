import { Typography, alpha, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const theme = useTheme();

  return (
    <Column
      alignItems="center"
      justifyContent="flex-start"
      spacing={1.5}
      sx={{
        width: '100%',
        height: '100%',
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        backgroundColor: alpha(theme.palette.common.white, 0.03),
        border: `1px solid ${alpha(theme.palette.common.white, 0.06)}`,
        textAlign: 'center',
      }}
    >
      <Column
        aria-hidden="true"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
          color: theme.palette.primary.main,
          '& svg': { fontSize: 22 },
        }}
      >
        {icon}
      </Column>
      <Typography
        sx={{
          color: 'text.primary',
          fontWeight: 700,
          fontSize: { xs: '0.95rem', md: '1.05rem' },
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.8rem', md: '0.85rem' },
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Column>
  );
};

export default FeatureCard;
