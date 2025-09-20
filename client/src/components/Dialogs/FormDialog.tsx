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
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';

export interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

interface FinSightDialogProps<T extends FieldValues> extends DialogProps {
  title: string;
  onSubmit: (data: T) => void;
  children: ReactNode;
}

const FormDialog = <T extends FieldValues>({
  isOpen,
  closeDialog,
  title,
  onSubmit,
  children,
}: FinSightDialogProps<T>) => {
  const { reset, handleSubmit } = useFormContext<T>();

  const closeForm = () => {
    reset();
    closeDialog();
  };

  const handleFormSubmit: SubmitHandler<T> = data => {
    onSubmit(data);
    reset();
    closeDialog();
  };

  return (
    <Dialog onClose={closeForm} open={isOpen} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={closeDialog}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit(handleFormSubmit)} id="transaction-form" noValidate>
        <DialogContent dividers>
          <Column spacing={2}>{children}</Column>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">
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
