import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useApiMutation } from '@/hooks/useApiMutation';
import { AccountDto } from '@/types/Account';

interface BalanceStepContentProps {
  accountId: string;
  onComplete: () => void;
}

const parseBalance = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return null;
  }

  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const num = Number(trimmed);

  if (!Number.isFinite(num)) {
    return null;
  }

  return num;
};

const BalanceStepContent = ({ accountId, onComplete }: BalanceStepContentProps) => {
  const { t, i18n } = useTranslation('user');
  const isRtl = i18n.dir() === 'rtl';
  const [rawValue, setRawValue] = useState('');
  const [showError, setShowError] = useState(false);

  const mutation = useApiMutation<AccountDto, { balance: number }>({
    method: 'patch',
    url: API_ROUTES.ACCOUNT_BY_ID(accountId),
    queryKeysToInvalidate: [queryKeys.accounts()],
  });

  const submitBalance = () => {
    const parsed = parseBalance(rawValue);

    if (parsed === null) {
      setShowError(true);
      return;
    }

    setShowError(false);
    mutation.mutate({ balance: parsed });
    onComplete();
  };

  const skipBalance = () => {
    onComplete();
  };

  const updateRawValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(event.target.value);

    if (showError) {
      setShowError(false);
    }
  };

  return (
    <Column spacing={2}>
      <Typography variant="h6" fontWeight={600}>
        {t('balanceStep.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {t('balanceStep.subtitle')}
      </Typography>

      <TextField
        variant="filled"
        label={t('balanceStep.label')}
        value={rawValue}
        onChange={updateRawValue}
        type="text"
        fullWidth
        error={showError}
        helperText={showError ? t('balanceStep.invalid') : ''}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" disablePointerEvents>
                ₪
              </InputAdornment>
            ),
            inputProps: {
              inputMode: 'decimal',
              dir: 'ltr',
              style: { textAlign: isRtl ? 'right' : 'left' },
            },
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={submitBalance}
        disabled={mutation.isPending}
        sx={{ mt: 1 }}
      >
        {t('balanceStep.continue')}
      </Button>

      <Button
        variant="text"
        onClick={skipBalance}
        disabled={mutation.isPending}
        sx={{
          color: 'text.secondary',
          alignSelf: 'center',
        }}
      >
        {t('balanceStep.skip')}
      </Button>
    </Column>
  );
};

export default BalanceStepContent;
