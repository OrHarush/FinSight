import { Box, ButtonBase, Typography } from '@mui/material';

const TYPE_COLOR: Record<'Income' | 'Expense', string> = {
  Income: '#10B981',
  Expense: '#F43F5E',
};

interface Props {
  label: string;
  amount: string;
  type: 'Income' | 'Expense';
  onClick: () => void;
}

const QuickAddButton = ({ label, amount, type, onClick }: Props) => {
  const color = TYPE_COLOR[type];

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'border-color 0.2s, background-color 0.2s',
        '&:hover': {
          borderColor: color,
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ₪{amount}
      </Typography>
    </ButtonBase>
  );
};

export default QuickAddButton;
