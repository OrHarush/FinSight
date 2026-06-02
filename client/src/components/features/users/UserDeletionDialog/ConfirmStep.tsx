import { Button, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface ConfirmStepProps {
  onBack: () => void;
  onConfirm: () => void;
}

const ConfirmStep = ({ onBack, onConfirm }: ConfirmStepProps) => {
  const { t } = useTranslation('user');
  const confirmKeyword = t('deleteDialog.confirmKeyword');
  const [confirmText, setConfirmText] = useState('');

  const isConfirmDisabled = confirmText.trim().toLowerCase() !== confirmKeyword;

  const submit = () => {
    if (isConfirmDisabled) {
      return;
    }

    onConfirm();
  };

  return (
    <>
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }}>
          <Typography>{t('deleteDialog.description')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('deleteDialog.instruction', { keyword: confirmKeyword })}
          </Typography>
          <TextField
            fullWidth
            autoFocus
            variant="outlined"
            value={confirmText}
            placeholder={t('deleteDialog.placeholder', { keyword: confirmKeyword })}
            onChange={e => setConfirmText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isConfirmDisabled) {
                e.preventDefault();
                submit();
              }
            }}
          />
        </Column>
      </DialogContent>
      <DialogActions>
        <Row spacing={1} sx={{ px: 2, pb: 1 }}>
          <Button variant="outlined" onClick={onBack}>
            {t('deleteDialog.back')}
          </Button>
          <Button variant="contained" color="error" onClick={submit} disabled={isConfirmDisabled}>
            {t('deleteDialog.confirm')}
          </Button>
        </Row>
      </DialogActions>
    </>
  );
};

export default ConfirmStep;
