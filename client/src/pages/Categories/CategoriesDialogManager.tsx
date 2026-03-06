import CreateCategoryDialog from '@/pages/Categories/components/dialogs/CreateCategoryDialog';
import EditCategoryDialog from '@/pages/Categories/components/dialogs/EditCategoryDialog';
import { CategoryDto } from '@/types/Category';

interface CategoriesDialogManagerProps {
  isCreateOpen: boolean;
  selectedCategory?: CategoryDto;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
}

const CategoriesDialogManager = ({
  isCreateOpen,
  selectedCategory,
  onCloseCreate,
  onCloseEdit,
}: CategoriesDialogManagerProps) => (
  <>
    {isCreateOpen && <CreateCategoryDialog isOpen={isCreateOpen} closeDialog={onCloseCreate} />}
    {selectedCategory && (
      <EditCategoryDialog
        isOpen={!!selectedCategory}
        closeDialog={onCloseEdit}
        category={selectedCategory}
      />
    )}
  </>
);

export default CategoriesDialogManager;
