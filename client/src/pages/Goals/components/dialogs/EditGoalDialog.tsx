import { CreateGoalDTO, UpdateGoalDTO } from '@lyra/shared';
import { Button, DialogActions, DialogContent } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import { useUpdateGoal } from '@/hooks/entities/useGoalMutations';
import {
  extractApiErrorCode,
  goalFormResolver,
} from '@/pages/Goals/components/dialogs/goalDialogShared';
import GoalForm from '@/pages/Goals/components/GoalForm';
import { useSnackbar } from '@/providers/SnackbarProvider';
import type { GoalDto } from '@/types/Goal';

interface EditGoalDialogProps extends BaseDialogProps {
  goal: GoalDto;
  currentValue?: number;
}

const FALLBACK_ICON = 'TrackChanges';
const FALLBACK_COLOR = '#9ca3af';

const buildDefaultsFromGoal = (goal: GoalDto): CreateGoalDTO => ({
  name: goal.name,
  icon: goal.icon ?? FALLBACK_ICON,
  color: goal.color ?? FALLBACK_COLOR,
  targetAmount: goal.targetAmount,
  initialAmount: goal.initialAmount ?? 0,
  targetDate: new Date(goal.targetDate),
  expectedAnnualReturn: goal.expectedAnnualReturn,
  importance: goal.importance,
  description: goal.description ?? '',
});

const buildPatchFromForm = (data: CreateGoalDTO): UpdateGoalDTO => ({
  name: data.name,
  icon: data.icon ?? null,
  color: data.color ?? null,
  targetAmount: data.targetAmount,
  initialAmount: data.initialAmount,
  targetDate: data.targetDate,
  expectedAnnualReturn: data.expectedAnnualReturn,
  importance: data.importance,
  description: data.description ?? null,
});

const EditGoalDialog = ({ isOpen, closeDialog, goal, currentValue }: EditGoalDialogProps) => {
  const { t } = useTranslation('goals');
  const { t: tCommon } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const updateGoal = useUpdateGoal();

  const methods = useForm<CreateGoalDTO>({
    resolver: goalFormResolver,
    mode: 'all',
    defaultValues: buildDefaultsFromGoal(goal),
  });

  const submitEdit = async (data: CreateGoalDTO) => {
    try {
      await updateGoal.mutateAsync({ goalId: goal._id, patch: buildPatchFromForm(data) });
      alertSuccess(t('toast.updated'));
      closeDialog();
    } catch (err) {
      if (extractApiErrorCode(err) === 'GOAL_NAME_TAKEN') {
        methods.setError('name', { message: t('errors.nameTaken') });

        return;
      }

      alertError(t('errors.updateFailed'));
    }
  };

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('dialog.editTitle')}
      maxWidth="sm"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitEdit)} noValidate>
          <DialogContent sx={{ pt: 1, px: { xs: 0, sm: 2 } }}>
            <Column spacing={2}>
              <GoalForm isEditing currentValue={currentValue} />
            </Column>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 0, sm: 2 } }}>
            <Button onClick={closeDialog} variant="outlined">
              {tCommon('buttons.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={updateGoal.isPending}>
              {tCommon('buttons.update')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </LyraDialog>
  );
};

export default EditGoalDialog;
