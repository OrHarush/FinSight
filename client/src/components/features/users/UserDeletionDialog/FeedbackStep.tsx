import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

import { getChipStyle } from './styles';
import { DELETION_REASONS, DeletionReason } from './types';

interface FeedbackStepProps {
  reason: DeletionReason | null;
  comment: string;
  onReasonChange: (next: DeletionReason | null) => void;
  onCommentChange: (next: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FeedbackStep = ({
  reason,
  comment,
  onReasonChange,
  onCommentChange,
  onCancel,
  onNext,
}: FeedbackStepProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();

  const toggleReason = (next: DeletionReason) => {
    onReasonChange(next === reason ? null : next);
  };

  return (
    <>
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }} height={'100%'}>
          <Typography>{t('deleteDialog.description')}</Typography>

          <Column spacing={1} height={'100%'}>
            <Typography variant="body2" color="text.secondary">
              {t('deleteDialog.feedback.label')}
            </Typography>
            <Row spacing={1} useFlexGap flexWrap="wrap">
              {DELETION_REASONS.map(r => (
                <Chip
                  key={r}
                  label={t(`deleteDialog.feedback.reasons.${r}`)}
                  variant="outlined"
                  onClick={() => toggleReason(r)}
                  sx={getChipStyle(theme, reason === r)}
                />
              ))}
            </Row>
            <TextField
              fullWidth
              multiline
              minRows={5}
              variant="filled"
              value={comment}
              placeholder={t('deleteDialog.feedback.commentPlaceholder')}
              onChange={e => onCommentChange(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              sx={{
                '& .MuiInputBase-root': {
                  height: 'auto',
                  alignItems: 'flex-start',
                },
              }}
            />
          </Column>
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={onCancel}>
            {t('deleteDialog.cancel')}
          </Button>
          <Button variant="contained" onClick={onNext} disabled={reason === null}>
            {t('deleteDialog.next')}
          </Button>
        </Row>
      </DialogActions>
    </>
  );
};

export default FeedbackStep;
