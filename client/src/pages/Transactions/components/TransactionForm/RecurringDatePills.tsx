import { TransactionFormValues } from '@lyra/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import i18n from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';

const pillSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '20px',
  px: 1.5,
  py: 0.5,
  cursor: 'pointer',
  '&:hover': { backgroundColor: 'action.hover' },
};

const RecurringDatePills = () => {
  const { t } = useTranslation('transactions');
  const { control, setValue, getValues } = useFormContext<TransactionFormValues>();
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const isRtl = i18n.language === 'he';

  useEffect(() => {
    if (!getValues('startDate')) {
      setValue('startDate', dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  return (
    <Row alignItems="center" justifyContent="center" spacing={1}>
      <Controller
        name="startDate"
        control={control}
        render={({ field, fieldState }) => {
          const value = field.value ? dayjs(field.value) : null;

          return (
            <Row
              alignItems="center"
              spacing={0.5}
              ref={startRef}
              sx={{
                ...pillSx,
                borderColor: fieldState.error ? 'error.main' : 'divider',
              }}
              onClick={() => setStartOpen(true)}
            >
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography
                variant="body2"
                fontWeight={600}
                color={value ? 'text.primary' : 'text.disabled'}
              >
                {value ? value.format('DD/MM/YYYY') : t('fields.startDate')}
              </Typography>
              <DesktopDatePicker
                value={value}
                onChange={(date: Dayjs | null) => {
                  field.onChange(date ? date.format('YYYY-MM-DD') : '');
                  setStartOpen(false);
                }}
                open={startOpen}
                onClose={() => setStartOpen(false)}
                slotProps={{
                  textField: { sx: { display: 'none' } },
                  popper: {
                    anchorEl: () => startRef.current as HTMLElement,
                    disablePortal: false,
                  },
                }}
              />
            </Row>
          );
        }}
      />

      {isRtl ? (
        <ArrowBackIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
      ) : (
        <ArrowForwardIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
      )}

      <Controller
        name="endDate"
        control={control}
        render={({ field }) => {
          const value = field.value ? dayjs(field.value) : null;

          return (
            <Row
              alignItems="center"
              spacing={0.5}
              ref={endRef}
              sx={pillSx}
              onClick={() => setEndOpen(true)}
            >
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography
                variant="body2"
                fontWeight={600}
                color={value ? 'text.primary' : 'text.disabled'}
              >
                {value ? value.format('DD/MM/YYYY') : t('fields.endDate')}
              </Typography>
              <DesktopDatePicker
                value={value}
                onChange={(date: Dayjs | null) => {
                  field.onChange(date ? date.format('YYYY-MM-DD') : '');
                  setEndOpen(false);
                }}
                open={endOpen}
                onClose={() => setEndOpen(false)}
                slotProps={{
                  textField: { sx: { display: 'none' } },
                  popper: {
                    anchorEl: () => endRef.current as HTMLElement,
                    disablePortal: false,
                  },
                }}
              />
            </Row>
          );
        }}
      />
    </Row>
  );
};

export default RecurringDatePills;
