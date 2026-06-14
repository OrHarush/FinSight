import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getCreateButtonStyle } from '@/components/shared/layout/BottomNav/styles';

interface BottomNavCreateButtonProps {
  onClick: (() => void) | null;
}

const BottomNavCreateButton = ({ onClick }: BottomNavCreateButtonProps) => {
  const { t } = useTranslation('common');

  if (!onClick) {
    return null;
  }

  return (
    <Fab color="primary" aria-label={t('buttons.create')} onClick={onClick} sx={getCreateButtonStyle()}>
      <AddIcon />
    </Fab>
  );
};

export default BottomNavCreateButton;
