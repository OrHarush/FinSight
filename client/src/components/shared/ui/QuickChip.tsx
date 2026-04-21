import { ButtonBase, Typography } from '@mui/material';

interface QuickChipProps {
  label: string;
  amount: number;
  isActive?: boolean;
  onClick: () => void;
}

const QuickChip = ({ label, amount, isActive = false, onClick }: QuickChipProps) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        bgcolor: isActive ? 'primary.main' : 'action.hover',
        border: '1px solid',
        borderColor: isActive ? 'primary.main' : 'divider',
        color: isActive ? 'primary.contrastText' : 'text.primary',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        '&:hover': {
          bgcolor: isActive ? 'primary.main' : 'action.selected',
          borderColor: isActive ? 'primary.main' : 'text.disabled',
        },
      }}
    >
      <Typography component="span" variant="body2" fontWeight={500}>
        {label}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ color: isActive ? 'primary.contrastText' : 'text.secondary' }}
      >
        ₪{amount.toLocaleString()}
      </Typography>
    </ButtonBase>
  );
};

export default QuickChip;
