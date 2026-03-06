import * as Icons from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import Row from '@/components/shared/layout/containers/Row';
import { Typography } from '@mui/material';
import { useCategories } from '@/hooks/entities/useCategories';
import { CategoryDto } from '@/types/Category';
import { useTranslation } from 'react-i18next';
import { getCategoryDisplayName } from '@/utils/categoryUtils';
import RHFSelect from '@/components/shared/inputs/RHFSelect';

interface CategoriesSelectProps {
  filteredCategories?: CategoryDto[];
}

const CategoriesSelect = ({ filteredCategories }: CategoriesSelectProps) => {
  const { t } = useTranslation('transactions');
  const { t: tCategories } = useTranslation('categories');
  const { categories } = useCategories();

  const categoriesToDisplay = filteredCategories || categories;

  return (
    <RHFSelect
      name="category"
      label={t('fields.category')}
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
              <Typography>{getCategoryDisplayName(category, tCategories)}</Typography>
            </Row>
          ),
        };
      })}
    />
  );
};

export default CategoriesSelect;
