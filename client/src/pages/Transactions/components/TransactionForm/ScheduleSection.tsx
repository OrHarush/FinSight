import { TransactionFormValues } from '@lyra/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Grid } from '@mui/material';
import i18n from 'i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import TextInput from '@/components/shared/inputs/TextInput';
import ResponsiveRow from '@/components/shared/layout/containers/ResponsiveRow';
import { useIsMobile } from '@/hooks/common/useIsMobile';

const ScheduleSection = () => {
  const { t } = useTranslation('transactions');
  const isRtl = i18n.language === 'he';
  const isMobile = useIsMobile();
  const { control } = useFormContext<TransactionFormValues>();

  const recurrence = useWatch({ control, name: 'recurrence' });

  if (recurrence !== 'None') {
    return (
      <Grid size={{ xs: 12, sm: 12 }}>
        <ResponsiveRow spacing={1}>
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <TextInput name="startDate" label={t('fields.startDate')} type="date" />
          </Box>
          {!isMobile && (
            <Box>
              {isRtl ? (
                <ArrowBackIcon sx={{ color: 'text.secondary', mt: '32px' }} />
              ) : (
                <ArrowForwardIcon sx={{ color: 'text.secondary', mt: '32px' }} />
              )}
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <TextInput name="endDate" label={t('fields.endDate')} type="month" />
          </Box>
        </ResponsiveRow>
      </Grid>
    );
  }

  return null;
};

export default ScheduleSection;
