import { Box } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { ElementType } from 'react';

interface CategoryIconFrameProps {
  color?: string;
  icon?: string;
}

type MuiIconName = keyof typeof Icons;

const DEFAULT_ICON: MuiIconName = 'Category';

const isValidMuiIcon = (icon: string): icon is MuiIconName => icon in Icons;

const CategoryIconFrame = ({ color = '#9ca3af', icon }: CategoryIconFrameProps) => {
  const resolvedIcon: MuiIconName = icon && isValidMuiIcon(icon) ? icon : DEFAULT_ICON;

  const IconComponent: ElementType = Icons[resolvedIcon];

  return (
    <Box
      sx={{
        backgroundColor: `${color}20`,
        borderRadius: '12px',
        width: 40,
        minWidth: 40,
        height: 40,
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <IconComponent sx={{ color, fontSize: 20 }} />
    </Box>
  );
};

export default CategoryIconFrame;
