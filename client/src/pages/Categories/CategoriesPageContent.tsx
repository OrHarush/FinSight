import CategoryIcon from '@mui/icons-material/Category';

import EntityEmpty from '@/components/entities/EntityEmpty';
import EntityError from '@/components/entities/EntityError';
import { useCategories } from '@/hooks/entities/useCategories';
import CategoryListSkeleton from '@/pages/Categories/components/CategoryListSkeleton';
import { CategoryDto } from '@/types/Category';

import CategoryList from './CategoryList';

interface CategoriesPageContentProps {
  selectCategory: (category: CategoryDto) => void;
}

const CategoriesPageContent = ({ selectCategory }: CategoriesPageContentProps) => {
  const { categories, isLoading, error, refetch } = useCategories();

  if (error) {
    return <EntityError entityName={'categories'} refetch={refetch} />;
  }

  if (isLoading) {
    return <CategoryListSkeleton />;
  }

  if (!categories.length) {
    return <EntityEmpty entityName={'categories'} icon={CategoryIcon} />;
  }

  return <CategoryList selectCategory={selectCategory} />;
};

export default CategoriesPageContent;
