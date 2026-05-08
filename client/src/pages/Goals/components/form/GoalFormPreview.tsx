import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatGoalAmount, formatLocalizedMonth } from '@/pages/Goals/utils/goalFormatters';

interface GoalFormPreviewProps {
  monthly: number;
  targetAmount: number;
  targetDate: Date | string;
  showHighWarning: boolean;
}

const GoalFormPreview = ({
  monthly,
  targetAmount,
  targetDate,
  showHighWarning,
}: GoalFormPreviewProps) => {
  const { t, i18n } = useTranslation('goals');
  const dateLabel = formatLocalizedMonth(targetDate, i18n.language);

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Row spacing={1} alignItems="flex-start">
        <LightbulbOutlinedIcon sx={{ fontSize: 18, mt: 0.25, flexShrink: 0 }} />
        <Column spacing={0.5} flex={1}>
          <Typography variant="body2" fontWeight={600}>
            {t('dialog.preview.requiredFull', {
              monthly: formatGoalAmount(monthly),
              target: formatGoalAmount(targetAmount),
              date: dateLabel,
            })}
          </Typography>
          {showHighWarning && (
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {t('dialog.preview.warningTooHigh')}
            </Typography>
          )}
        </Column>
      </Row>
    </Box>
  );
};

export default GoalFormPreview;
