import CategoryIcon from '@mui/icons-material/Category';
import { Chip } from '@mui/material';
import { ElementType } from 'react';

import { categoryIconMap } from '@/constants/categoryIconMap';

interface CategoryValueProps {
  name: string;
  color: string;
  icon?: string;
}

const CategoryChip = ({ name, color, icon }: CategoryValueProps) => {
  const IconComponent: ElementType = (icon && categoryIconMap[icon]) || CategoryIcon;

  return (
    <Chip
      icon={<IconComponent color={color} sx={{ color: color }} />}
      label={name}
      variant="outlined"
      sx={{
        width: '160px',
        height: '36px',
        justifyContent: 'flex-start',
        textAlign: 'left',
        padding: '0 12px',
        borderColor: 'default',
        color: 'inherit',
      }}
    />
  );
};

export default CategoryChip;
