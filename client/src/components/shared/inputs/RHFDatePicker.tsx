import { InputLabel, TextFieldProps } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';

import Column from '@/components/shared/layout/containers/Column';
import { useIsMobile } from '@/hooks/common/useIsMobile';

interface RHFDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  textFieldProps?: TextFieldProps;
}

const sharedPickerProps = (
  textFieldProps: TextFieldProps | undefined,
  error: boolean,
  helperText: string | undefined,
  ref: React.Ref<unknown>
) => ({
  views: ['year', 'month', 'day'] as const,
  openTo: 'day' as const,
  format: 'DD/MM/YYYY',
  slotProps: {
    textField: {
      ...textFieldProps,
      fullWidth: true,
      size: 'small' as const,
      error,
      helperText,
      inputRef: ref,
      label: undefined,
    },
  },
});

export function RHFDatePicker<T extends FieldValues>({
  name,
  label,
  textFieldProps,
}: RHFDatePickerProps<T>) {
  const { control } = useFormContext();
  const isMobile = useIsMobile();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value ? dayjs(field.value) : null;
        const onChange = (date: dayjs.Dayjs | null) =>
          field.onChange(date ? date.format('YYYY-MM-DD') : '');
        const shared = sharedPickerProps(
          textFieldProps,
          !!fieldState.error,
          fieldState.error?.message,
          field.ref
        );

        return (
          <Column spacing={0.5} sx={{ minWidth: 0.5 }}>
            {label && <InputLabel>{label}</InputLabel>}
            {isMobile ? (
              <MobileDatePicker
                {...shared}
                value={value}
                onChange={onChange}
                slotProps={{
                  ...shared.slotProps,
                  dialog: {
                    sx: {
                      '& .MuiDayCalendar-weekDayLabel': { width: 40, height: 40 },
                      '& .MuiPickersDay-root': { width: 40, height: 40, fontSize: '1rem' },
                    },
                  },
                }}
              />
            ) : (
              <DesktopDatePicker
                {...shared}
                value={value}
                onChange={onChange}
                slotProps={{
                  ...shared.slotProps,
                  desktopPaper: {
                    sx: {
                      '& .MuiDayCalendar-weekDayLabel': { width: 40, height: 40 },
                      '& .MuiPickersDay-root': { width: 40, height: 40, fontSize: '1rem' },
                    },
                  },
                }}
              />
            )}
          </Column>
        );
      }}
    />
  );
}
