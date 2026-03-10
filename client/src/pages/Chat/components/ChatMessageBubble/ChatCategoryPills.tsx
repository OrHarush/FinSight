import { Chip, Grid } from '@mui/material';
import * as Icons from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { ElementType } from 'react';
import { CategoryDto } from '@/types/Category';

interface ChatCategoryPillsProps {
  categories: CategoryDto[];
}

const ChatCategoryPills = ({ categories }: ChatCategoryPillsProps) => (
  <Grid container spacing={1} sx={{ mt: 0.5 }}>
    {categories.map(category => {
      const IconComponent: ElementType =
        (category.icon && (Icons as Record<string, ElementType>)[category.icon]) || CategoryIcon;

      return (
        <Grid key={category._id} size={{ xs: 6, sm: 4, md: 3 }}>
          <Chip
            icon={<IconComponent sx={{ color: `${category.color} !important`, fontSize: 18 }} />}
            label={category.name}
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              px: 1,
              py: 0.5,
              height: 'auto',
              width: '100%',
              '& .MuiChip-label': {
                px: 0.75,
                py: 0.25,
              },
            }}
          />
        </Grid>
      );
    })}
  </Grid>
);

export default ChatCategoryPills;
