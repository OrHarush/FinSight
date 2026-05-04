import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  alpha,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

export const DELETION_REASONS = [
  'too_complex',
  'missing_feature',
  'found_alternative',
  'not_useful',
  'privacy_concern',
  'just_testing',
  'other',
] as const;

export type DeletionReason = (typeof DELETION_REASONS)[number];

export interface DeletionFeedbackPayload {
  reason: DeletionReason | null;
  comment: string | null;
  locale: 'he' | 'en';
}

interface UserDeletionDialogProps extends BaseDialogProps {
  onConfirm: (feedback: DeletionFeedbackPayload) => void;
}

const UserDeletionDialog = ({ isOpen, closeDialog, onConfirm }: UserDeletionDialogProps) => {
  const { t, i18n } = useTranslation('user');
  const theme = useTheme();
  const confirmKeyword = t('deleteDialog.confirmKeyword');
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState<DeletionReason | null>(null);
  const [comment, setComment] = useState('');

  const isConfirmDisabled = confirmText.trim().toLowerCase() !== confirmKeyword;
  const locale: 'he' | 'en' = i18n.language.startsWith('he') ? 'he' : 'en';

  const selectReason = (next: DeletionReason) => {
    if (next === reason) {
      setReason(null);
      return;
    }

    if (next !== 'other') {
      setComment('');
    }

    setReason(next);
  };

  const submitDeletion = () => {
    if (isConfirmDisabled) {
      return;
    }

    const trimmedComment = comment.trim();
    const finalComment = reason === 'other' && trimmedComment ? trimmedComment : null;

    onConfirm({ reason, comment: finalComment, locale });
    setConfirmText('');
  };

  const closeDeletionDialog = () => {
    setConfirmText('');
    setReason(null);
    setComment('');
    closeDialog();
  };

  const getChipStyle = (isActive: boolean) => ({
    cursor: 'pointer',
    borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
    '&:hover': {
      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.18) : theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
    },
  });

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDeletionDialog}
      title={t('deleteDialog.title')}
      titleIcon={WarningAmberRoundedIcon}
    >
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }}>
          <Typography>{t('deleteDialog.description')}</Typography>

          <Column spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {t('deleteDialog.feedback.label')}
            </Typography>
            <Row spacing={1} useFlexGap flexWrap="wrap">
              {DELETION_REASONS.map(r => (
                <Chip
                  key={r}
                  label={t(`deleteDialog.feedback.reasons.${r}`)}
                  variant="outlined"
                  onClick={() => selectReason(r)}
                  sx={getChipStyle(reason === r)}
                />
              ))}
            </Row>
            {reason === 'other' && (
              <TextField
                fullWidth
                multiline
                rows={2}
                value={comment}
                placeholder={t('deleteDialog.feedback.commentPlaceholder')}
                onChange={e => setComment(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
            )}
          </Column>

          <Typography variant="body2" color="text.secondary">
            {t('deleteDialog.instruction', { keyword: confirmKeyword })}
          </Typography>
          <TextField
            fullWidth
            value={confirmText}
            placeholder={t('deleteDialog.placeholder', { keyword: confirmKeyword })}
            onChange={e => setConfirmText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isConfirmDisabled) {
                e.preventDefault();
                submitDeletion();
              }
            }}
          />
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={closeDeletionDialog}>
            {t('deleteDialog.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={submitDeletion}
            disabled={isConfirmDisabled}
          >
            {t('deleteDialog.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </LyraDialog>
  );
};

export default UserDeletionDialog;
