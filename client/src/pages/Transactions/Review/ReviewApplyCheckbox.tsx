import { Checkbox } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface ReviewApplyCheckboxProps {
  name: string;
}

const ReviewApplyCheckbox = ({ name }: ReviewApplyCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          checked={!!field.value}
          onChange={(_, checked) => field.onChange(checked)}
        />
      )}
    />
  );
};

export default ReviewApplyCheckbox;
