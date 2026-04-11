import { IconButton } from '@mui/material';

interface ExpandPickerButtonProps {
  onClick: () => void;
}

const ExpandPickerButton = ({ onClick }: ExpandPickerButtonProps) => (
  <IconButton
    type="button"
    onClick={onClick}
    sx={{
      width: 36,
      height: 36,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      fontSize: 14,
      color: 'text.secondary',
    }}
  >
    ···
  </IconButton>
);

export default ExpandPickerButton;
