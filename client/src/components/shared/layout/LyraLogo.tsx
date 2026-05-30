import { Typography, useTheme } from '@mui/material';

import lyraIcon from '@/assets/lyraIcon.webp';
import Row from '@/components/shared/layout/containers/Row';

interface LyraLogoProps {
  iconSize?: number;
  showWordmark?: boolean;
  alt?: string;
}

const LyraLogo = ({ iconSize = 32, showWordmark = true, alt = 'Lyra' }: LyraLogoProps) => {
  const theme = useTheme();

  return (
    <Row alignItems="center" spacing={1}>
      <img
        src={lyraIcon}
        alt={alt}
        style={{ width: iconSize, height: iconSize, objectFit: 'contain' }}
      />
      {showWordmark && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          Lyra
        </Typography>
      )}
    </Row>
  );
};

export default LyraLogo;
