import FormDialog from '@/components/dialogs/FormDialog';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormProvider, useForm } from 'react-hook-form';
import { BaseDialogProps } from '@/components/dialogs/FinSightDialog';
import FeedbackForm from './FeedbackForm';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CreateFeedbackCommand } from '../../../../../shared/types/FeedbackCommands';
import { useAuth } from '@/providers/AuthProvider';

export interface FeedbackFormValues {
  message: string;
  type?: 'feedback' | 'bug' | 'idea';
}

const FeedbackDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const location = useLocation();
  const { user } = useAuth();

  const methods = useForm<FeedbackFormValues>({
    defaultValues: {
      type: 'feedback',
    },
  });

  const submitFeedback = useApiMutation<void, CreateFeedbackCommand>({
    method: 'post',
    url: API_ROUTES.FEEDBACK,
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      console.log('sending feedback...');
      console.log({
        message: data.message,
        email: user?.email,
        metadata: {
          route: location.pathname,
        },
      });
      await submitFeedback.mutateAsync({
        message: data.message,
        email: user?.email,
        metadata: {
          route: location.pathname,
        },
      });

      alertSuccess(t('feedback.messages.success'));
      closeDialog();
    } catch (err) {
      alertError(t('feedback.messages.error'));
      console.error(err);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        title={t('feedback.title')}
        onSubmit={onSubmit}
      >
        <FeedbackForm />
      </FormDialog>
    </FormProvider>
  );
};

export default FeedbackDialog;
