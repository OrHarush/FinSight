import { Box, SxProps, Theme } from '@mui/material';

import lyraIcon from '@/assets/lyraIconNoBg.webp';

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

interface Props {
  /** Ring diameter in px. Default: 160 */
  size?: number;
  /** Override icon dimensions — accepts responsive values */
  iconSx?: SxProps<Theme>;
  /** Play spring entry animation on the icon (used in LoadingScreen) */
  animateIcon?: boolean;
}

const getRingStyle = (size: number, delay: number): SxProps<Theme> => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  border: '1px solid',
  borderColor: 'primary.main',
  opacity: 0,
  '@keyframes sonarPulse': {
    '0%': { transform: 'scale(0.7)', opacity: 0 },
    '20%': { opacity: 0.6 },
    '100%': { transform: 'scale(1.3)', opacity: 0 },
  },
  animation: `sonarPulse 2.4s ease-out ${delay}s infinite`,
  [REDUCED_MOTION]: { animation: 'none', opacity: 0 },
});

const getBaseIconStyle = (size: number, animate: boolean): SxProps<Theme> => {
  const iconPx = Math.round(size * 0.55);
  const base: SxProps<Theme> = {
    position: 'relative',
    zIndex: 2,
    width: iconPx,
    height: iconPx,
    objectFit: 'contain',
  };

  if (!animate) {
    return base;
  }

  return {
    ...base,
    opacity: 0,
    '@keyframes iconSpring': {
      '0%': { transform: 'scale(0.55)', opacity: 0 },
      '55%': { transform: 'scale(1.1)', opacity: 1 },
      '75%': { transform: 'scale(0.94)' },
      '90%': { transform: 'scale(1.03)' },
      '100%': { transform: 'scale(1)', opacity: 1 },
    },
    animation: 'iconSpring 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    [REDUCED_MOTION]: { animation: 'none', opacity: 1, transform: 'scale(1)' },
  };
};

const LyraPulseIcon = ({ size = 160, iconSx, animateIcon = false }: Props) => (
  <Box
    sx={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Box sx={getRingStyle(size, 0)} />
    <Box sx={getRingStyle(size, 0.6)} />
    <Box sx={getRingStyle(size, 1.2)} />
    <Box
      component="img"
      src={lyraIcon}
      alt="Lyra"
      sx={[getBaseIconStyle(size, animateIcon), ...(Array.isArray(iconSx) ? iconSx : [iconSx ?? {}])]}
    />
  </Box>
);

export default LyraPulseIcon;
