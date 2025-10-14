import RHFSelect from '../inputs/RHFSelect';
import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import Row from '@/components/layout/Containers/Row';
import { Typography } from '@mui/material';
import { useCategories } from '@/hooks/useCategories';
import { CategoryDto } from '@/types/Category';

interface CategoriesSelectProps {
  filteredCategories?: CategoryDto[];
}

const CategoriesSelect = ({ filteredCategories }: CategoriesSelectProps) => {
  const { categories } = useCategories();

  const categoriesToDisplay = filteredCategories || categories;

  return (
    <RHFSelect
      name="category"
      label="Category"
      required
      options={categoriesToDisplay.map(category => {
        const IconComponent =
          (category.icon && (Icons as Record<string, SvgIconComponent>)[category.icon]) ||
          CategoryIcon;

        return {
          label: category.name,
          value: category._id,
          design: (
            <Row spacing={1}>
              <IconComponent sx={{ color: category.color }} />
              <Typography>{category.name}</Typography>
            </Row>
          ),
        };
      })}
    />
  );
};

export default CategoriesSelect;
