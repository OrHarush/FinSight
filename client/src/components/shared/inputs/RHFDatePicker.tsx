import { InputLabel, TextFieldProps } from '@mui/material';
import { DateView } from '@mui/x-date-pickers';
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
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  monthYearOnly?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface PickerMode {
  views: readonly DateView[];
  openTo: DateView;
  format: string;
}

const DAY_PICKER_MODE: PickerMode = {
  views: ['year', 'month', 'day'],
  openTo: 'day',
  format: 'DD/MM/YYYY',
};

const MONTH_PICKER_MODE: PickerMode = {
  views: ['year', 'month'],
  openTo: 'month',
  format: 'MM/YYYY',
};

const buildSharedPickerProps = (
  mode: PickerMode,
  textFieldProps: TextFieldProps | undefined,
  error: boolean,
  helperText: string | undefined,
  ref: React.Ref<unknown>
) => ({
  views: mode.views,
  openTo: mode.openTo,
  format: mode.format,
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

const normalizeToMonthStart = (date: dayjs.Dayjs | null): dayjs.Dayjs | null =>
  date ? date.startOf('month') : null;

export function RHFDatePicker<T extends FieldValues>({
  name,
  label,
  textFieldProps,
  minDate,
  maxDate,
  monthYearOnly = false,
  open,
  onOpen,
  onClose,
}: RHFDatePickerProps<T>) {
  const { control } = useFormContext();
  const isMobile = useIsMobile();
  const mode = monthYearOnly ? MONTH_PICKER_MODE : DAY_PICKER_MODE;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value ? dayjs(field.value) : null;

        const onChange = (date: dayjs.Dayjs | null) => {
          const normalized = monthYearOnly ? normalizeToMonthStart(date) : date;

          field.onChange(normalized ? normalized.format('YYYY-MM-DD') : '');
        };

        const shared = buildSharedPickerProps(
          mode,
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
                minDate={minDate}
                maxDate={maxDate}
                open={open}
                onOpen={onOpen}
                onClose={onClose}
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
                minDate={minDate}
                maxDate={maxDate}
                open={open}
                onOpen={onOpen}
                onClose={onClose}
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
