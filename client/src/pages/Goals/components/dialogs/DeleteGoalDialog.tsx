import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import { useDeleteGoal } from '@/hooks/entities/useGoalMutations';
import { extractApiErrorCode } from '@/pages/Goals/components/dialogs/goalDialogShared';
import { useSnackbar } from '@/providers/SnackbarProvider';
import type { GoalDto } from '@/types/Goal';

interface DeleteGoalDialogProps extends BaseDialogProps {
  goal: GoalDto;
  redirectAfterDelete?: boolean;
}

type Step = 'choice' | 'confirm';
type Choice = 'keep' | 'drop';

const buildOptions = (t: TFunction) => [
  { value: 'keep' as const, titleKey: 'delete.step1Keep', noteKey: 'delete.step1NoteKeep' },
  { value: 'drop' as const, titleKey: 'delete.step1Drop', noteKey: 'delete.step1NoteDrop' },
].map(o => ({ ...o, title: t(o.titleKey), note: t(o.noteKey) }));

const DeleteGoalDialog = ({
  isOpen,
  closeDialog,
  goal,
  redirectAfterDelete = true,
}: DeleteGoalDialogProps) => {
  const { t } = useTranslation('goals');
  const { t: tCommon } = useTranslation('common');
  const { alertSuccess, alertError } = useSnackbar();
  const navigate = useNavigate();
  const deleteGoal = useDeleteGoal();
  const [step, setStep] = useState<Step>('choice');
  const [choice, setChoice] = useState<Choice>('keep');
  const [hasTransactionsError, setHasTransactionsError] = useState(false);

  const resetState = () => {
    setStep('choice');
    setChoice('keep');
    setHasTransactionsError(false);
  };

  const closeAndReset = () => {
    resetState();
    closeDialog();
  };

  const goToConfirmStep = () => setStep('confirm');

  const showTransactionsConflict = () => {
    setStep('choice');
    setChoice('keep');
    setHasTransactionsError(true);
  };

  const submitDelete = async () => {
    const keepCategory = choice === 'keep';

    try {
      await deleteGoal.mutateAsync({ goalId: goal._id, keepCategory });
      alertSuccess(t('toast.deleted'));
      closeAndReset();

      if (redirectAfterDelete) {
        navigate('/goals');
      }
    } catch (err) {
      if (extractApiErrorCode(err) === 'CATEGORY_HAS_TRANSACTIONS') {
        showTransactionsConflict();

        return;
      }

      alertError(t('errors.deleteFailed'));
    }
  };

  const options = buildOptions(t);

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeAndReset}
      title={t('delete.step1Title', { name: goal.name })}
      forceDialog
    >
      <DialogContent sx={{ pt: 1 }}>
        <Column spacing={2}>
          {step === 'choice' && (
            <RadioGroup value={choice} onChange={e => setChoice(e.target.value as Choice)}>
              {options.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Column spacing={0.25}>
                      <Typography variant="body2" fontWeight={600}>
                        {option.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.note}
                      </Typography>
                      {option.value === 'drop' && hasTransactionsError && (
                        <Alert severity="warning" sx={{ mt: 0.5, py: 0.25 }}>
                          {t('delete.errorHasTransactions')}
                        </Alert>
                      )}
                    </Column>
                  }
                />
              ))}
            </RadioGroup>
          )}
          {step === 'confirm' && (
            <Typography variant="body1">{t('delete.step2Title')}</Typography>
          )}
        </Column>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAndReset} variant="outlined">
          {tCommon('buttons.cancel')}
        </Button>
        {step === 'choice' && (
          <Button onClick={goToConfirmStep} variant="contained">
            {tCommon('buttons.continue')}
          </Button>
        )}
        {step === 'confirm' && (
          <Button
            onClick={submitDelete}
            variant="contained"
            color="error"
            disabled={deleteGoal.isPending}
          >
            {tCommon('buttons.delete')}
          </Button>
        )}
      </DialogActions>
    </LyraDialog>
  );
};

export default DeleteGoalDialog;
