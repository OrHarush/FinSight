import { CreateGoalDTO } from '@lyra/shared';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import { useCreateGoal } from '@/hooks/entities/useGoalMutations';
import {
  extractApiErrorCode,
  goalFormResolver,
} from '@/pages/Goals/components/dialogs/goalDialogShared';
import GoalForm, { defaultGoalFormValues } from '@/pages/Goals/components/GoalForm';
import { useSnackbar } from '@/providers/SnackbarProvider';

const CreateGoalDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('goals');
  const { t: tCommon } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const navigate = useNavigate();
  const createGoal = useCreateGoal();

  const methods = useForm<CreateGoalDTO>({
    resolver: goalFormResolver,
    defaultValues: defaultGoalFormValues() as CreateGoalDTO,
    mode: 'all',
  });

  const closeAndReset = () => {
    methods.reset(defaultGoalFormValues() as CreateGoalDTO);
    closeDialog();
  };

  const submitNewGoal = async (data: CreateGoalDTO) => {
    try {
      const created = await createGoal.mutateAsync(data);
      alertSuccess(t('toast.created'));
      closeAndReset();
      navigate(`/goals/${created._id}`);
    } catch (err) {
      if (extractApiErrorCode(err) === 'GOAL_NAME_TAKEN') {
        methods.setError('name', { message: t('errors.nameTaken') });

        return;
      }

      alertError(t('errors.createFailed'));
    }
  };

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeAndReset}
      title={t('dialog.createTitle')}
      maxWidth="sm"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitNewGoal)} noValidate>
          <DialogContent sx={{ pt: 1, px: { xs: 0, sm: 2 } }}>
            <Column spacing={2}>
              <GoalForm />
            </Column>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 0, sm: 2 } }}>
            <Button onClick={closeAndReset} variant="outlined">
              {tCommon('buttons.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={createGoal.isPending}>
              {t('dialog.createSubmit')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </LyraDialog>
  );
};

export default CreateGoalDialog;
