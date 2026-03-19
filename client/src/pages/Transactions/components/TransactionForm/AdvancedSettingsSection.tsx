import { Box, Collapse, Grid, IconButton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Row from '@/components/shared/layout/containers/Row';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountSection from '@/pages/Transactions/components/TransactionForm/AccountSection';
import PaymentSection from '@/pages/Transactions/components/TransactionForm/PaymentSection';
import RecurrenceSelect from '@/pages/Transactions/components/TransactionForm/RecurrenceSelect';
import ScheduleSection from '@/pages/Transactions/components/TransactionForm/ScheduleSection';

const AdvancedSettingsSection = () => {
  const { t } = useTranslation('transactions');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 1.5,
          py: 1,
        }}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('fields.advancedSettings')}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              setIsExpanded(prev => !prev);
            }}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Row>

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={1.5}>
              <AccountSection />
              <PaymentSection />
              <RecurrenceSelect />
              <ScheduleSection />
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </Grid>
  );
};

export default AdvancedSettingsSection;
