import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ElementType } from 'react';

import { DEFAULT_HOUSEHOLD_ICON } from '@/constants/HouseholdIcons';
import { householdIconMap } from '@/constants/householdIconMap';

interface HouseholdIconFrameProps {
  icon?: string;
  size?: number;
  shape?: 'rounded' | 'circle';
}

const resolveIcon = (icon?: string): ElementType =>
  (icon && householdIconMap[icon]) || householdIconMap[DEFAULT_HOUSEHOLD_ICON];

const HouseholdIconFrame = ({
  icon,
  size = 40,
  shape = 'rounded',
}: HouseholdIconFrameProps) => {
  const theme = useTheme();
  const IconComponent = resolveIcon(icon);
  const iconSize = Math.round(size * 0.5);
  const borderRadius = shape === 'circle' ? '50%' : '12px';

  return (
    <Box
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderRadius,
        width: size,
        minWidth: size,
        height: size,
        minHeight: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <IconComponent sx={{ color: 'primary.main', fontSize: iconSize }} />
    </Box>
  );
};

export default HouseholdIconFrame;
