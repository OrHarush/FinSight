import { Button, DialogActions, DialogContent } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import FinSightDialog, { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import { useTranslation } from 'react-i18next';

interface FormDialogProps<T extends FieldValues> extends BaseDialogProps {
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
  const { t } = useTranslation('common');
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
      <form onSubmit={handleSubmit(handleFormSubmit)} id="form-dialog" noValidate>
        <DialogContent>
          <Column spacing={2}>{children}</Column>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} variant="outlined">
            {t('buttons.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {isUpdateForm ? t('buttons.update') : t('buttons.create')}
          </Button>
        </DialogActions>
      </form>
    </FinSightDialog>
  );
};

export default FormDialog;
