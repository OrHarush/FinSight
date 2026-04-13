import AddIcon from '@mui/icons-material/Add';
import { Button, SxProps, Theme } from '@mui/material';

const CONFIG = {
  Income: {
    bg: 'rgba(16, 185, 129, 0.12)',
    hoverBg: 'rgba(16, 185, 129, 0.2)',
    color: '#10B981',
  },
  Expense: {
    bg: 'rgba(244, 63, 94, 0.12)',
    hoverBg: 'rgba(244, 63, 94, 0.2)',
    color: '#F43F5E',
  },
};

interface Props {
  type: 'Income' | 'Expense';
  label: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const CreateTransactionButton = ({ type, label, onClick, sx }: Props) => {
  const { bg, hoverBg, color } = CONFIG[type];

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={[
        {
          minWidth: 160,
          bgcolor: bg,
          color,
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 2,
          px: 2.5,
          boxShadow: 'none',
          '&:hover': { bgcolor: hoverBg, boxShadow: 'none' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {label}
    </Button>
  );
};

export default CreateTransactionButton;
