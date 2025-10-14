import EntityError from '@/components/entities/EntityError';
import { useCategories } from '@/hooks/useCategories';
import EntityEmpty from '@/components/entities/EntityEmpty';
import CategoryList from '@/pages/Categories/CategoryList';
import CategoryIcon from '@mui/icons-material/Category';
import { CategoryDto } from '@/types/Category';
import CategoryListSkeleton from '@/pages/Categories/Skeletons/CategoryListSkeleton';

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
