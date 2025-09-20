import { Chip } from '@mui/material';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { ElementType } from 'react';

interface CategoryValueProps {
  name: string;
  color: string;
  icon?: string;
}

const CategoryValue = ({ name, color, icon }: CategoryValueProps) => {
  const IconComponent = (icon && (Icons as Record<string, ElementType>)[icon]) || CategoryIcon;

  return (
    <Chip
      icon={<IconComponent color={color} sx={{ color: color }} />}
      label={name}
      variant="outlined"
      sx={{
        padding: '0 12px',
        borderColor: 'default',
        color: 'inherit',
      }}
    />
  );
};

export default CategoryValue;
