import { MenuItem, Select, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useCategories } from '@/hooks/useCategories';
import Row from '@/components/layout/Containers/Row';
import { SvgIconComponent } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';

interface CategorySelectProps {
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

const CategorySelect = ({ selectedCategory, setSelectedCategory }: CategorySelectProps) => {
  const { t } = useTranslation('categories');
  const { categories } = useCategories();

  return (
    <Select
      value={selectedCategory}
      onChange={e => setSelectedCategory(e.target.value)}
      displayEmpty
      sx={{
        width: '190px',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            mt: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxHeight: '400px',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              },
            },
          },
        },
      }}
    >
      <MenuItem value="">
        <Row spacing={1.5} sx={{ alignItems: 'center' }}>
          <CategoryIcon sx={{ color: 'text.secondary', fontSize: '20px' }} />
          <Typography sx={{ fontWeight: 500 }}>{t('allCategories')}</Typography>
        </Row>
      </MenuItem>
      {categories.map(category => {
        const IconComponent =
          (category.icon && (Icons as Record<string, SvgIconComponent>)[category.icon]) ||
          CategoryIcon;

        return (
          <MenuItem key={category._id} value={category._id}>
            <Row spacing={1.5} sx={{ alignItems: 'center' }}>
              <IconComponent
                sx={{
                  color: category.color,
                  fontSize: '20px',
                  transition: 'transform 0.2s ease',
                  '.MuiMenuItem-root:hover &': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
              <Typography sx={{ fontWeight: 500 }}>{category.name}</Typography>
            </Row>
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default CategorySelect;
