import CategoryIcon from '@mui/icons-material/Category';
import { Typography } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { useCategories } from '@/hooks/entities/useCategories';
import { CategoryDto } from '@/types/Category';
import { getCategoryDisplayName } from '@/utils/categoryUtils';

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
        const IconComponent: ElementType = (category.icon && categoryIconMap[category.icon]) || CategoryIcon;

        return {
          label: category.name,
          value: category._id,
          design: (
            <Row spacing={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <IconComponent sx={{ color: category.color, flexShrink: 0 }} />
              <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getCategoryDisplayName(category, tCategories)}
              </Typography>
            </Row>
          ),
        };
      })}
    />
  );
};

export default CategoriesSelect;
