import { CreateGoalDTO } from '@lyra/shared';
import { Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RHFDatePicker } from '@/components/shared/inputs/RHFDatePicker';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatLocalizedMonth, parseTargetDate } from '@/pages/Goals/utils/goalFormatters';
import { addMonthsUtc, monthsBetweenUtc, startOfTodayUtc } from '@/pages/Goals/utils/goalPreview';

const QUICK_PICKS = [6, 12, 24, 60, 120] as const;

type QuickPick = (typeof QUICK_PICKS)[number];

const GoalDeadlinePicker = () => {
  const { t, i18n } = useTranslation('goals');
  const { control, setValue } = useFormContext<CreateGoalDTO>();
  const targetDate = useWatch({ control, name: 'targetDate' });
  const today = useMemo(() => startOfTodayUtc(), []);

  const parsedTargetDate = useMemo(() => parseTargetDate(targetDate), [targetDate]);
  const currentMonths = parsedTargetDate ? monthsBetweenUtc(today, parsedTargetDate) : null;
  const dateLabel = parsedTargetDate ? formatLocalizedMonth(parsedTargetDate, i18n.language) : null;

  const setDuration = (months: QuickPick) => {
    setValue('targetDate', addMonthsUtc(today, months), {
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
      <RHFDatePicker name="targetDate" minDate={dayjs(today)} />
      {currentMonths !== null && currentMonths > 0 && dateLabel && (
        <Typography variant="caption" color="text.secondary">
          {t('dialog.deadlineHint', { months: currentMonths, date: dateLabel })}
        </Typography>
      )}
    </Column>
  );
};

export default GoalDeadlinePicker;
