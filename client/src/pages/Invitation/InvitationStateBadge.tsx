import { SvgIconComponent } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export type InvitationBadgeTone = 'primary' | 'success' | 'neutral' | 'error';

interface InvitationStateBadgeProps {
  icon: SvgIconComponent;
  tone?: InvitationBadgeTone;
  size?: number;
}

const InvitationStateBadge = ({
  icon: Icon,
  tone = 'primary',
  size = 96,
}: InvitationStateBadgeProps) => {
  const theme = useTheme();

  const palette = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    neutral: theme.palette.text.secondary,
    error: theme.palette.error.main,
  };

  const accent = palette[tone];

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: alpha(accent, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sx={{ color: accent, fontSize: Math.round(size * 0.46) }} />
    </Box>
  );
};

export default InvitationStateBadge;
