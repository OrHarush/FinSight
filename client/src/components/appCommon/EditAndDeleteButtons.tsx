import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Row from '@/components/layout/Containers/Row';

interface EditAndDeleteButtonsProps {
  onEdit?: () => void;
  onConfirmDelete?: () => void;
  isEditDisabled?: boolean;
  isDeleteDisabled?: boolean;
  requireConfirmation?: boolean;
  entityType?: string;
  entityName?: string;
  confirmationMessage?: string;
  disabledReason?: string;
}

const EditAndDeleteButtons = ({
  onEdit,
  onConfirmDelete,
  isEditDisabled = false,
  isDeleteDisabled = false,
  requireConfirmation = true,
  entityType = 'item',
  entityName,
  confirmationMessage,
  disabledReason,
}: EditAndDeleteButtonsProps) => {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (onConfirmDelete) {
      onConfirmDelete();
    }
    // if (requireConfirmation) {
    //   setConfirmOpen(true);
    // } else {
    //   onConfirmDelete?.();
    // }
  };

  return (
    <>
      <Row>
        {onEdit && (
          <IconButton
            onClick={onEdit}
            size="medium"
            disabled={isEditDisabled}
            aria-label={`Edit ${entityType}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          onClick={handleDeleteClick}
          size="medium"
          color="error"
          disabled={isDeleteDisabled}
          aria-label={`Delete ${entityType}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Row>
      {/*{requireConfirmation && (*/}
      {/*  <DeletionConfirmationDialog*/}
      {/*    isOpen={confirmOpen}*/}
      {/*    closeDialog={() => setConfirmOpen(false)}*/}
      {/*    onConfirm={() => onConfirmDelete?.()}*/}
      {/*    entityType={entityType}*/}
      {/*    entityName={entityName}*/}
      {/*    message={confirmationMessage}*/}
      {/*    disabledReason={disabledReason}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default EditAndDeleteButtons;
