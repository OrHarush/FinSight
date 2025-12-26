import { Typography } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
      role="button"
      tabIndex={0}
      onClick={() => navigate(navigateTo)}
      onKeyDown={e => e.key === 'Enter' && navigate(navigateTo)}
      sx={{
        cursor: 'pointer',
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(139,92,246,0.08)',
          transform: 'translateX(2px)',
        },
        '&:focus-visible': {
          outline: '2px solid rgba(139,92,246,0.5)',
        },
      }}
    >
      {done ? (
        <CheckCircleIcon sx={{ color: '#22c55e' }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ opacity: 0.4 }} />
      )}

      <Typography sx={{ flex: 1, opacity: done ? 0.9 : 0.6 }}>{label}</Typography>

      <ChevronRightIcon sx={{ opacity: 0.35 }} />
    </Row>
  );
};

export default ChecklistItem;
