import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { TransactionFormValues } from '@/types/Transaction';
import TextInput from '@/components/shared/inputs/TextInput';
import Row from '@/components/shared/layout/containers/Row';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ScheduleSectionProps {
  isTransfer?: boolean;
}

const ScheduleSection = ({ isTransfer = false }: ScheduleSectionProps) => {
  const { t } = useTranslation('transactions');
  const { control } = useFormContext<TransactionFormValues>();

  const recurrence = useWatch({ control, name: 'recurrence' });

  if (recurrence === 'None') {
    return (
      <Grid size={{ xs: 12, sm: isTransfer ? 12 : 6 }}>
        <TextInput name="date" label={t('fields.date')} type="date" />
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Row spacing={1}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextInput name="startDate" label={t('fields.startDate')} type="date" />
        </Box>
        <Box>
          <ArrowForwardIcon sx={{ color: 'text.secondary', mt: '32px' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextInput name="endDate" label={t('fields.endDate')} type="month" />
        </Box>
      </Row>
    </Grid>
  );
};

export default ScheduleSection;
