import { CreateGoalDTO } from '@lyra/shared';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import GoalDeadlinePicker from '@/pages/Goals/components/form/GoalDeadlinePicker';
import GoalFormPreview from '@/pages/Goals/components/form/GoalFormPreview';
import GoalStyleTrigger from '@/pages/Goals/components/form/GoalStyleTrigger';
import ImportanceToggle from '@/pages/Goals/components/form/ImportanceToggle';
import InvestmentReturnSection from '@/pages/Goals/components/form/InvestmentReturnSection';
import { parseTargetDate } from '@/pages/Goals/utils/goalFormatters';
import {
  addMonthsUtc,
  monthsBetweenUtc,
  requiredMonthlyContribution,
  startOfTodayUtc,
} from '@/pages/Goals/utils/goalPreview';
import { suggestGoalIcon } from '@/pages/Goals/utils/suggestGoalIcon';

const HIGH_INCOME_THRESHOLD = 0.5;
const MIN_INCOME_FOR_WARNING = 1000;
const DEFAULT_DURATION_MONTHS = 12;

interface GoalFormProps {
  isEditing?: boolean;
  currentValue?: number;
  avgMonthlyIncome?: number;
}

const GoalForm = ({ isEditing = false, currentValue, avgMonthlyIncome = 0 }: GoalFormProps) => {
  const { t } = useTranslation('goals');
  const { control, setValue } = useFormContext<CreateGoalDTO>();
  const [iconUserSet, setIconUserSet] = useState(isEditing);

  const name = useWatch({ control, name: 'name' });
  const icon = useWatch({ control, name: 'icon' });
  const color = useWatch({ control, name: 'color' });
  const targetAmount = useWatch({ control, name: 'targetAmount' });
  const targetDate = useWatch({ control, name: 'targetDate' });
  const initialAmount = useWatch({ control, name: 'initialAmount' });
  const expectedAnnualReturn = useWatch({ control, name: 'expectedAnnualReturn' });

  const [investedOverride, setInvestedOverride] = useState<boolean | null>(null);
  const investedFromValue = (expectedAnnualReturn ?? 0) > 0;
  const invested = investedOverride ?? investedFromValue;

  useEffect(() => {
    if (targetDate) return;

    setValue('targetDate', addMonthsUtc(startOfTodayUtc(), DEFAULT_DURATION_MONTHS), {
      shouldValidate: false,
    });
  }, [targetDate, setValue]);

  useEffect(() => {
    if (iconUserSet) return;

    setValue('icon', suggestGoalIcon(name), { shouldValidate: false });
  }, [name, iconUserSet, setValue]);

  const effectiveCurrentValue = currentValue ?? Number(initialAmount ?? 0);
  const parsedTargetDate = useMemo(() => parseTargetDate(targetDate), [targetDate]);

  const required = useMemo(() => {
    if (!targetAmount || !parsedTargetDate) return null;

    const months = monthsBetweenUtc(startOfTodayUtc(), parsedTargetDate);

    return requiredMonthlyContribution(
      effectiveCurrentValue,
      Number(targetAmount),
      months,
      Number(expectedAnnualReturn ?? 0)
    );
  }, [targetAmount, parsedTargetDate, effectiveCurrentValue, expectedAnnualReturn]);

  const hasUsableIncomeBaseline = avgMonthlyIncome > MIN_INCOME_FOR_WARNING;
  const showHighWarning =
    required !== null &&
    hasUsableIncomeBaseline &&
    required > avgMonthlyIncome * HIGH_INCOME_THRESHOLD;

  const updateInvestmentReturn = (next: number) =>
    setValue('expectedAnnualReturn', next, { shouldValidate: true });

  const markIconUserSelected = () => setIconUserSet(true);

  return (
    <Column spacing={2}>
      <Row spacing={1.5} alignItems="center">
        <GoalStyleTrigger
          icon={icon}
          color={color}
          onIconUserSelected={markIconUserSelected}
        />
        <Box sx={{ flex: 1 }}>
          <TextInput
            name="name"
            label={t('dialog.fields.name')}
            placeholder={t('dialog.fields.namePlaceholder')}
            required
          />
        </Box>
      </Row>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput
            name="targetAmount"
            label={t('dialog.fields.targetAmount')}
            type="number"
            required
            min={1}
            thousandSeparators
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextInput
            name="initialAmount"
            label={t('dialog.fields.initialAmount')}
            type="number"
            min={0}
            thousandSeparators
          />
        </Grid>
      </Grid>

      <GoalDeadlinePicker />

      <Column spacing={0.75}>
        <Typography variant="caption" color="text.secondary">
          {t('dialog.fields.importance')}
        </Typography>
        <Controller
          control={control}
          name="importance"
          render={({ field }) => (
            <ImportanceToggle
              value={field.value ?? 'medium'}
              onChange={value => field.onChange(value)}
            />
          )}
        />
      </Column>

      <TextInput
        name="description"
        label={t('dialog.fields.description')}
        placeholder={t('dialog.fields.descriptionPlaceholder')}
        multiline
        minRows={2}
        maxRows={4}
        maxLength={500}
      />

      <InvestmentReturnSection
        value={Number(expectedAnnualReturn ?? 0)}
        onChange={updateInvestmentReturn}
        invested={invested}
        onInvestedChange={setInvestedOverride}
      />

      {required !== null && required > 0 && parsedTargetDate && targetAmount && (
        <GoalFormPreview
          monthly={required}
          targetAmount={Number(targetAmount)}
          targetDate={parsedTargetDate}
          showHighWarning={showHighWarning}
        />
      )}
    </Column>
  );
};

export const defaultGoalFormValues = (): Partial<CreateGoalDTO> => ({
  name: '',
  icon: 'TrackChanges',
  color: '#9c27b0',
  targetAmount: 0,
  initialAmount: 0,
  targetDate: addMonthsUtc(startOfTodayUtc(), DEFAULT_DURATION_MONTHS),
  expectedAnnualReturn: 0,
  importance: 'medium',
  description: '',
});

export default GoalForm;
