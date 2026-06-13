import CategoryIcon from '@mui/icons-material/Category';
import { Typography } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import RHFSelect from '@/components/shared/inputs/RHFSelect';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { CategoryDto } from '@/types/Category';

interface ReviewCategorySelectProps {
  name: string;
  categories: CategoryDto[];
}

const ReviewCategorySelect = ({ name, categories }: ReviewCategorySelectProps) => {
  const { t } = useTranslation('transactions');

  return (
    <RHFSelect
      name={name}
      label={t('review.columns.category')}
      required
      options={categories.map(category => {
        const IconComponent: ElementType =
          (category.icon && categoryIconMap[category.icon]) || CategoryIcon;

        return {
          label: category.name,
          value: category._id,
          design: (
            <Row spacing={1} alignItems="center" sx={{ minWidth: 0, overflow: 'hidden' }}>
              <IconComponent sx={{ fontSize: '1.3rem', color: category.color, flexShrink: 0 }} />
              <Typography
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {category.name}
              </Typography>
            </Row>
          ),
        };
      })}
    />
  );
};

export default ReviewCategorySelect;
