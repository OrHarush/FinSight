import { Typography } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from 'react-router-dom';

interface ChecklistItemProps {
  done: boolean;
  label: string;
  navigateTo: string;
}

const ChecklistItem = ({ done, label, navigateTo }: ChecklistItemProps) => {
  const navigate = useNavigate();

  return (
    <Row
      spacing={1}
      alignItems="center"
      onClick={() => navigate(navigateTo)}
      sx={{
        cursor: 'pointer',
        px: 1,
        py: 1,
        borderRadius: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(139,92,246,0.08)',
        },
      }}
    >
      {done ? (
        <CheckCircleIcon sx={{ color: '#22c55e' }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ opacity: 0.4 }} />
      )}
      <Typography sx={{ opacity: done ? 0.9 : 0.6 }}>{label}</Typography>
    </Row>
  );
};

export default ChecklistItem;
