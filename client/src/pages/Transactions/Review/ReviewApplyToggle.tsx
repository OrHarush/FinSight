import { FormControlLabel, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ReviewApplyToggleProps {
  name: string;
}

const ReviewApplyToggle = ({ name }: ReviewApplyToggleProps) => {
  const { control } = useFormContext();
  const { t } = useTranslation('transactions');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={!!field.value}
              onChange={(_, checked) => field.onChange(checked)}
            />
          }
          label={t('review.applyToFuture')}
        />
      )}
    />
  );
};

export default ReviewApplyToggle;
