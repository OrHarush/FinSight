import { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Row from '@/components/layout/Containers/Row';
import DeletionConfirmationDialog from '@/components/dialogs/DeletionConfirmationDialog';

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (requireConfirmation) {
      setConfirmOpen(true);
    } else {
      onConfirmDelete?.();
    }
  };

  return (
    <>
      <Row spacing={1}>
        <IconButton
          onClick={onEdit}
          size="large"
          disabled={isEditDisabled}
          aria-label={`Edit ${entityType}`}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleDeleteClick}
          size="large"
          color="error"
          disabled={isDeleteDisabled}
          aria-label={`Delete ${entityType}`}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Row>
      {requireConfirmation && (
        <DeletionConfirmationDialog
          isOpen={confirmOpen}
          closeDialog={() => setConfirmOpen(false)}
          onConfirm={() => onConfirmDelete?.()}
          entityType={entityType}
          entityName={entityName}
          message={confirmationMessage}
          disabledReason={disabledReason}
        />
      )}
    </>
  );
};

export default EditAndDeleteButtons;
