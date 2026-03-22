import { TransactionFormValues } from '@finsight/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Grid } from '@mui/material';
import i18n from 'i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import Row from '@/components/shared/layout/containers/Row';

interface ScheduleSectionProps {
  isTransfer?: boolean;
}

const ScheduleSection = ({ isTransfer = false }: ScheduleSectionProps) => {
  const { t } = useTranslation('transactions');
  const isRtl = i18n.language === 'he';
  const { control } = useFormContext<TransactionFormValues>();

  const recurrence = useWatch({ control, name: 'recurrence' });

  if (recurrence === 'None' && isTransfer) {
    return (
      <Grid size={{ xs: 12 }}>
        <TextInput name="date" label={t('fields.date')} type="date" />
      </Grid>
    );
  }

  if (recurrence !== 'None') {
    return (
      <Grid size={{ xs: 12, sm: 12 }}>
        <Row spacing={1}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextInput name="startDate" label={t('fields.startDate')} type="date" />
          </Box>
          <Box>
            <Box>
              {isRtl ? (
                <ArrowBackIcon sx={{ color: 'text.secondary', mt: '32px' }} />
              ) : (
                <ArrowForwardIcon sx={{ color: 'text.secondary', mt: '32px' }} />
              )}
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextInput name="endDate" label={t('fields.endDate')} type="month" />
          </Box>
        </Row>
      </Grid>
    );
  }

  return null;
};

export default ScheduleSection;
