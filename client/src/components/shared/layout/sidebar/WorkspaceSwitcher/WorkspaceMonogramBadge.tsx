import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ElementType } from 'react';

import { DEFAULT_HOUSEHOLD_ICON } from '@/constants/HouseholdIcons';
import { householdIconMap } from '@/constants/householdIconMap';

const FALLBACK_COLOR = '#9ca3af';

const resolveIcon = (icon?: string): ElementType =>
  (icon && householdIconMap[icon]) || householdIconMap[DEFAULT_HOUSEHOLD_ICON];

interface WorkspaceMonogramBadgeProps {
  name: string;
  color?: string;
  icon?: string;
  size?: number;
}

const WorkspaceMonogramBadge = ({
  color,
  icon,
  size = 32,
}: WorkspaceMonogramBadgeProps) => {
  const accent = color || FALLBACK_COLOR;
  const IconComponent = resolveIcon(icon);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '10px',
        backgroundColor: alpha(accent, 0.18),
        color: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <IconComponent sx={{ fontSize: Math.round(size * 0.55) }} />
    </Box>
  );
};

export default WorkspaceMonogramBadge;
