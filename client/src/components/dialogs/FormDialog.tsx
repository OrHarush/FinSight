import { Breakpoint, Button, DialogActions, DialogContent } from '@mui/material';
import { ReactNode } from 'react';
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';

interface FormDialogProps<T extends FieldValues> extends BaseDialogProps {
  title: string;
  onSubmit: (data: T) => void;
  children: ReactNode;
  isUpdateForm?: boolean;
  maxWidth?: Breakpoint;
}

const FormDialog = <T extends FieldValues>({
  isOpen,
  closeDialog,
  title,
  onSubmit,
  children,
  isUpdateForm = false,
  maxWidth = 'xs',
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
    <LyraDialog closeDialog={closeForm} isOpen={isOpen} title={title} maxWidth={maxWidth}>
      <form onSubmit={handleSubmit(handleFormSubmit)} id="form-dialog" noValidate>
        <DialogContent sx={{ pt: 1 }}>
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
    </LyraDialog>
  );
};

export default FormDialog;
