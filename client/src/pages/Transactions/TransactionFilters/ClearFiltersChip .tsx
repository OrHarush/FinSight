import CloseIcon from '@mui/icons-material/Close';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ClearFiltersChipProps {
  onClick: () => void;
  iconOnly?: boolean;
}

const ClearFiltersChip = ({ onClick, iconOnly = false }: ClearFiltersChipProps) => {
  const { t } = useTranslation('transactions');

  return (
    <Chip
      label={iconOnly ? undefined : t('filters.reset')}
      icon={iconOnly ? <CloseIcon /> : undefined}
      deleteIcon={iconOnly ? undefined : <CloseIcon />}
      variant="outlined"
      onClick={onClick}
      onDelete={iconOnly ? undefined : onClick}
      sx={{
        flexShrink: 0,
        color: 'error.main',
        borderColor: 'error.main',
        height: '40px',
        borderRadius: '8px',
        ...(iconOnly && {
          minWidth: '40px',
          width: '40px',
          px: 0,
          '& .MuiChip-label': { display: 'none' },
          '& .MuiChip-icon': { mx: 'auto', color: 'error.main' },
        }),
        ...(!iconOnly && {
          '& .MuiChip-deleteIcon': { color: 'error.main' },
        }),
      }}
    />
  );
};

export default ClearFiltersChip;
