import { TransactionFormValues } from '@lyra/shared';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Grid } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const ScheduleSection = () => {
  const { t } = useTranslation('transactions');
  const { t: tCommon } = useTranslation('common');

  const translateError = (message?: string) =>
    message ? tCommon(message as Parameters<typeof tCommon>[0]) : undefined;
  const isMobile = useIsMobile();
  const { control } = useFormContext<TransactionFormValues>();

  const recurrence = useWatch({ control, name: 'recurrence' });

  if (recurrence === 'None') {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Row spacing={1} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <DesktopDatePicker
                label={t('fields.startDate')}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date: Dayjs | null) =>
                  field.onChange(date ? date.format('YYYY-MM-DD') : '')
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: translateError(fieldState.error?.message),
                    size: 'small',
                  },
                }}
              />
            )}
          />
        </Box>
        {!isMobile && (
          <Box sx={{ pt: '10px' }}>
            <ArrowForwardIcon
              sx={{
                color: 'text.secondary',
                transform: theme => (theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'),
              }}
            />
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Controller
            name="endDate"
            control={control}
            render={({ field, fieldState }) => (
              <DesktopDatePicker
                label={`${t('fields.endDate')} (${tCommon('fields.optional')})`}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date: Dayjs | null) =>
                  field.onChange(date ? date.format('YYYY-MM-DD') : '')
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: translateError(fieldState.error?.message),
                    size: 'small',
                  },
                }}
              />
            )}
          />
        </Box>
      </Row>
    </Grid>
  );
};

export default ScheduleSection;
