import { Box, Checkbox, Chip, Collapse, Divider, Slider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const RETURN_PRESETS = [0, 4, 6, 8] as const;

interface InvestmentReturnSectionProps {
  value: number;
  onChange: (value: number) => void;
  invested: boolean;
  onInvestedChange: (invested: boolean) => void;
}

const InvestmentReturnSection = ({
  value,
  onChange,
  invested,
  onInvestedChange,
}: InvestmentReturnSectionProps) => {
  const { t } = useTranslation('goals');

  const toggleInvested = (next: boolean) => {
    onInvestedChange(next);

    if (!next) {
      onChange(0);
    } else if (value === 0) {
      onChange(6);
    }
  };

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Row alignItems="flex-start" spacing={1}>
        <Checkbox
          checked={invested}
          onChange={e => toggleInvested(e.target.checked)}
          size="small"
          sx={{ mt: -0.5 }}
        />
        <Column flex={1} spacing={0.25}>
          <Typography variant="body2" fontWeight={600}>
            {t('dialog.advanced.investedTitle')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('dialog.advanced.investedSubtitle')}
          </Typography>
        </Column>
      </Row>
      <Collapse in={invested} timeout="auto" unmountOnExit>
        <Column spacing={1.5} sx={{ pt: 1.5 }}>
          <Divider />
          <Row alignItems="center" spacing={2}>
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 96 }}>
              {t('dialog.advanced.returnLabel')}
            </Typography>
            <Typography variant="body2" fontWeight={700} color="primary.main">
              {value}%
            </Typography>
          </Row>
          <Box sx={{ px: 1 }}>
            <Slider
              value={value}
              onChange={(_, next) => onChange(Array.isArray(next) ? next[0] : next)}
              min={0}
              max={20}
              step={0.5}
              size="small"
            />
          </Box>
          <Row spacing={1} flexWrap="wrap">
            {RETURN_PRESETS.map(preset => (
              <Chip
                key={preset}
                size="small"
                variant={value === preset ? 'filled' : 'outlined'}
                color={value === preset ? 'primary' : 'default'}
                label={t(`dialog.advanced.presets.${preset}`)}
                onClick={() => onChange(preset)}
              />
            ))}
          </Row>
        </Column>
      </Collapse>
    </Box>
  );
};

export default InvestmentReturnSection;
