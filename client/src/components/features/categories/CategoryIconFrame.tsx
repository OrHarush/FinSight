import { Box } from '@mui/material';
import { ElementType } from 'react';
import { categoryIconMap } from '@/constants/categoryIconMap';

interface CategoryIconFrameProps {
  color?: string;
  icon?: string;
}

const DEFAULT_ICON = 'Category';

const resolveIcon = (icon?: string): ElementType =>
  (icon && categoryIconMap[icon]) || categoryIconMap[DEFAULT_ICON];

const CategoryIconFrame = ({ color = '#9ca3af', icon }: CategoryIconFrameProps) => {
  const IconComponent = resolveIcon(icon);

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
