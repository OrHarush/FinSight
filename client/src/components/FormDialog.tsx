import {
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Column from '@/components/Layout/Column';
import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

interface FinSightDialogProps {
  isOpen: boolean;
  close: () => void;
  title: string;
  onSubmit: (data: any) => void;
  children: ReactNode;
}

const FormDialog = ({ isOpen, close, title, onSubmit, children }: FinSightDialogProps) => {
  const { handleSubmit } = useFormContext();

  return (
    <Dialog onClose={close} open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={close}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit(onSubmit)} id="transaction-form">
        <DialogContent dividers>
          <Column spacing={2}>{children}</Column>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
