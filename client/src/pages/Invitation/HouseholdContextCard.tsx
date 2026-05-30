import { Box, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { getMonogram } from '@/pages/Invitation/utils/nameUtils';

const FALLBACK_COLOR = '#9ca3af';

interface HouseholdContextCardProps {
  name: string;
  color?: string;
}

const HouseholdContextCard = ({ name, color }: HouseholdContextCardProps) => {
  const { t } = useTranslation('user');
  const theme = useTheme();
  const accent = color || FALLBACK_COLOR;

  return (
    <Row
      spacing={1.5}
      alignItems="center"
      sx={{
        width: '100%',
        backgroundColor: alpha(theme.palette.text.primary, 0.04),
        border: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
        borderRadius: 2,
        px: 1.5,
        py: 1.25,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          backgroundColor: accent,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {getMonogram(name)}
      </Box>
      <Column sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('sharedHousehold.landing.householdSubtitle')}
        </Typography>
      </Column>
    </Row>
  );
};

export default HouseholdContextCard;
