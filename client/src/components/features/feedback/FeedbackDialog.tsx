import { CreateFeedbackCommand } from '@lyra/shared';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import FormDialog from '@/components/dialogs/FormDialog';
import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

import FeedbackForm from './FeedbackForm';

export interface FeedbackFormValues {
  message: string;
  type?: 'feedback' | 'bug' | 'idea';
}

interface FeedbackDialogProps extends BaseDialogProps {
  variant?: 'manual' | 'popup';
}

const FeedbackDialog = ({ isOpen, closeDialog, variant = 'manual' }: FeedbackDialogProps) => {
  const { t } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const location = useLocation();
  const { user } = useAuth();

  const methods = useForm<FeedbackFormValues>({
    defaultValues: { type: 'feedback' },
  });

  const submitFeedback = useApiMutation<void, CreateFeedbackCommand>({
    method: 'post',
    url: API_ROUTES.FEEDBACK,
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback.mutateAsync({
        message: data.message,
        type: data.type,
        variant,
        email: user?.email,
        metadata: { route: location.pathname },
      });

      alertSuccess(t('feedback.messages.success'));
    } catch (err) {
      alertError(t('feedback.messages.error'));
      console.error(err);
    }
  };

  const handlePopupSubmit: SubmitHandler<FeedbackFormValues> = data => {
    onSubmit(data);
    methods.reset();
    closeDialog();
  };

  if (variant === 'popup') {
    return (
      <FormProvider {...methods}>
        <LyraDialog isOpen={isOpen} closeDialog={closeDialog} title={t('feedback.title')}>
          <form onSubmit={methods.handleSubmit(handlePopupSubmit)} noValidate>
            <DialogContent sx={{ pt: 1 }}>
              <FeedbackForm variant="popup" />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} variant="outlined" sx={{ flex: 1 }}>
                {t('feedback.popup.skip')}
              </Button>
              <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                {t('buttons.send')}
              </Button>
            </DialogActions>
          </form>
        </LyraDialog>
      </FormProvider>
    );
  }

  const handleManualSubmit = (data: FeedbackFormValues) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('feedback.title')}
        onSubmit={handleManualSubmit}
      >
        <FeedbackForm />
      </FormDialog>
    </FormProvider>
  );
};

export default FeedbackDialog;
