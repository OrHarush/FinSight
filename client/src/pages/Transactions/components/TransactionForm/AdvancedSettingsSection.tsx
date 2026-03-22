import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp';
import { Box, Collapse, Grid, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
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
          mt: 1,
          paddingRight: 0.75,
          paddingLeft: 1.5,
          py: 1,
        }}
      >
        <Row alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('fields.advancedSettings')}
          </Typography>
          <IconButton
            onClick={() => setIsExpanded(prev => !prev)}
            size="small"
            sx={{ width: 24, height: 24, minWidth: 24, minHeight: 24 }}
          >
            {isExpanded ? <ArrowDropUpSharpIcon /> : <ArrowDropDownSharpIcon />}
          </IconButton>
        </Row>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={1.5} padding={0.5}>
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
