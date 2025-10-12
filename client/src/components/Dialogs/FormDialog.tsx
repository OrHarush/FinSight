import { Button, DialogActions, DialogContent } from '@mui/material';
import Column from '@/components/Layout/Containers/Column';
import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import FinSightDialog from '@/components/Dialogs/FinSightDialog';

export interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
}

interface FormDialogProps<T extends FieldValues> extends DialogProps {
  title: string;
  onSubmit: (data: T) => void;
  children: ReactNode;
  isUpdateForm?: boolean;
}

const FormDialog = <T extends FieldValues>({
  isOpen,
  closeDialog,
  title,
  onSubmit,
  children,
  isUpdateForm = false,
}: FormDialogProps<T>) => {
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
    <FinSightDialog closeDialog={closeForm} isOpen={isOpen} title={title}>
      <form onSubmit={handleSubmit(handleFormSubmit)} id="transaction-form" noValidate>
        <DialogContent dividers>
          <Column spacing={2}>{children}</Column>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isUpdateForm ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </FinSightDialog>
  );
};

export default FormDialog;
