import BlockIcon from '@mui/icons-material/Block';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getSkippedChipStyle } from './styles';

interface SkippedChipProps {
  count: number;
}

const SkippedChip = ({ count }: SkippedChipProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Chip
      size="small"
      icon={<BlockIcon sx={{ fontSize: 16 }} />}
      label={t('importWizard.confirm.skippedChip', { count })}
      sx={getSkippedChipStyle}
    />
  );
};

export default SkippedChip;
