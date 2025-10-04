import { IconButton } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditAndDeleteButtonsProps {
  onEdit?: () => void;
  isEditDisabled?: boolean;
  onDelete?: () => void;
  isDeleteDisabled?: boolean;
}

const EditAndDeleteButtons = ({
  onEdit = () => {},
  isEditDisabled = false,
  onDelete = () => {},
  isDeleteDisabled = false,
}: EditAndDeleteButtonsProps) => (
  <Row spacing={1}>
    <IconButton onClick={onEdit} size="small" disabled={isEditDisabled}>
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton onClick={onDelete} size="small" color="error" disabled={isDeleteDisabled}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Row>
);

export default EditAndDeleteButtons;
