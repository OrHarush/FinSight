import { alpha, Typography, useTheme } from '@mui/material';

interface FrameChipProps {
  label: string;
}

const FrameChip = ({ label }: FrameChipProps) => {
  const theme = useTheme();

  return (
    <Typography
      variant="caption"
      sx={{
        alignSelf: 'flex-start',
        px: 1.25,
        py: 0.5,
        borderRadius: '999px',
        backgroundColor: alpha(theme.palette.primary.main, 0.14),
        color: theme.palette.primary.main,
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </Typography>
  );
};

export default FrameChip;
