import { CreateGoalDTO } from '@lyra/shared';
import { Box, Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatLocalizedMonth, parseTargetDate } from '@/pages/Goals/utils/goalFormatters';
import { addMonthsUtc, monthsBetweenUtc, startOfTodayUtc } from '@/pages/Goals/utils/goalPreview';

const QUICK_PICKS = [6, 12, 24, 60, 120] as const;
const PICKER_DESCENDANT_SELECTOR = '[class*="MuiPicker"]';

type QuickPick = (typeof QUICK_PICKS)[number];

const isClickInsidePicker = (target: Node): boolean => {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest(PICKER_DESCENDANT_SELECTOR) !== null;
};

const GoalDeadlinePicker = () => {
  const { t, i18n } = useTranslation('goals');
  const { control, setValue } = useFormContext<CreateGoalDTO>();
  const targetDate = useWatch({ control, name: 'targetDate' });
  const today = useMemo(() => startOfTodayUtc(), []);

  const parsedTargetDate = useMemo(() => parseTargetDate(targetDate), [targetDate]);
  const currentMonths = parsedTargetDate ? monthsBetweenUtc(today, parsedTargetDate) : null;
  const dateLabel = parsedTargetDate ? formatLocalizedMonth(parsedTargetDate, i18n.language) : null;

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const openPicker = () => setIsPickerOpen(true);
  const closePicker = () => setIsPickerOpen(false);

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    const handleOutsideMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      if (fieldRef.current?.contains(target)) {
        return;
      }

      if (isClickInsidePicker(target)) {
        return;
      }

      closePicker();
    };

    document.addEventListener('mousedown', handleOutsideMouseDown, true);

    return () => document.removeEventListener('mousedown', handleOutsideMouseDown, true);
  }, [isPickerOpen]);

  const setDuration = (months: QuickPick) => {
    const target = addMonthsUtc(today, months);
    const monthStart = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), 1));

    setValue('targetDate', monthStart, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Column spacing={1}>
      <Typography variant="caption" color="text.secondary">
        {t('dialog.fields.targetDate')}
      </Typography>
      <Row spacing={1} flexWrap="wrap">
        {QUICK_PICKS.map(months => {
          const isActive = currentMonths === months;

          return (
            <Chip
              key={months}
              size="small"
              label={t(`dialog.quickPick.${months}`)}
              variant={isActive ? 'filled' : 'outlined'}
              color={isActive ? 'primary' : 'default'}
              onClick={() => setDuration(months)}
            />
          );
        })}
      </Row>
      <Box ref={fieldRef}>
        <RHFDatePicker
          name="targetDate"
          minDate={dayjs(today)}
          monthYearOnly
          open={isPickerOpen}
          onOpen={openPicker}
          onClose={closePicker}
          textFieldProps={{
            onClick: openPicker,
            InputProps: { readOnly: true },
            sx: { '& .MuiFilledInput-root, & input': { cursor: 'pointer' } },
          }}
        />
      </Box>
      {currentMonths !== null && currentMonths > 0 && dateLabel && (
        <Typography variant="caption" color="text.secondary">
          {t('dialog.deadlineHint', { months: currentMonths, date: dateLabel })}
        </Typography>
      )}
    </Column>
  );
};

export default GoalDeadlinePicker;
