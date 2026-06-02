import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';

import ConfirmStep from './ConfirmStep';
import DeletingStep from './DeletingStep';
import FeedbackStep from './FeedbackStep';
import { DeletionFeedbackPayload, DeletionReason, DeletionStep } from './types';

export type { DeletionFeedbackPayload, DeletionReason } from './types';
export { DELETION_REASONS } from './types';

interface UserDeletionDialogProps extends BaseDialogProps {
  onConfirm: (feedback: DeletionFeedbackPayload) => void;
  isDeletionError: boolean;
  isDeletionSuccess: boolean;
  onDeletionComplete: () => void;
}

const UserDeletionDialog = ({
  isOpen,
  closeDialog,
  onConfirm,
  isDeletionError,
  isDeletionSuccess,
  onDeletionComplete,
}: UserDeletionDialogProps) => {
  const { t, i18n } = useTranslation('user');
  const [step, setStep] = useState<DeletionStep>('feedback');
  const [reason, setReason] = useState<DeletionReason | null>(null);
  const [comment, setComment] = useState('');

  const locale: 'he' | 'en' = i18n.language.startsWith('he') ? 'he' : 'en';

  useEffect(() => {
    if (isDeletionError && step === 'deleting') {
      setStep('confirm');
    }
  }, [isDeletionError, step]);

  const resetAndClose = () => {
    setStep('feedback');
    setReason(null);
    setComment('');
    closeDialog();
  };

  const startDeletion = () => {
    setStep('deleting');
  };

  const fireDeletion = () => {
    const trimmedComment = comment.trim();
    const finalComment = trimmedComment ? trimmedComment : null;

    onConfirm({ reason, comment: finalComment, locale });
  };

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={resetAndClose}
      title={t('deleteDialog.title')}
      titleIcon={WarningAmberRoundedIcon}
      forceDialog
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          paddingY: 1,
          paddingX: 1,
          height: 'fit-content',
          maxHeight: '90vh',
        },
      }}
    >
      {step === 'feedback' && (
        <FeedbackStep
          reason={reason}
          comment={comment}
          onReasonChange={setReason}
          onCommentChange={setComment}
          onCancel={resetAndClose}
          onNext={() => setStep('confirm')}
        />
      )}
      {step === 'confirm' && (
        <ConfirmStep onBack={() => setStep('feedback')} onConfirm={startDeletion} />
      )}
      {step === 'deleting' && (
        <DeletingStep
          onReachFinalize={fireDeletion}
          isComplete={isDeletionSuccess}
          onAnimationDone={onDeletionComplete}
        />
      )}
    </LyraDialog>
  );
};

export default UserDeletionDialog;
