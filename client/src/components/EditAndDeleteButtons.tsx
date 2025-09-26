import { IconButton } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface EditAndDeleteButtonsProps {
  onDelete: () => void;
  onEdit: () => void;
}

const EditAndDeleteButtons = ({ onEdit, onDelete }: EditAndDeleteButtonsProps) => {
  return (
    <Row spacing={1}>
      <IconButton onClick={onEdit} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={onDelete} size="small" color="error">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Row>
  );
};

export default EditAndDeleteButtons;
