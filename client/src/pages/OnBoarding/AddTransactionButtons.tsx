import AddIcon from '@mui/icons-material/Add';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { ButtonBase, Divider, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useCategories } from '@/hooks/entities/useCategories';
import { VARIABLE_CHIP_CONFIG, VARIABLE_CHIP_KEYS, VariableChipKey } from '@/pages/OnBoarding/contants';
import QuickAddButton from '@/pages/OnBoarding/QuickAddButton';
import { QuickAddPreset } from '@/pages/OnBoarding/types';
import { resolvePresetCategory } from '@/utils/entities/category';

interface AddTransactionButtonsProps {
  openWithPreset: (preset: QuickAddPreset) => void;
}

const AddTransactionButtons = ({ openWithPreset }: AddTransactionButtonsProps) => {
  const { t } = useTranslation('overview');
  const { categories } = useCategories();
  const navigate = useNavigate();

  const resolvedVariableChips = VARIABLE_CHIP_KEYS.map((key: VariableChipKey) => {
    const { type, amount } = VARIABLE_CHIP_CONFIG[key];
    const label = t(`setup.variableChips.${key}.label`);
    const amountLabel = t(`setup.variableChips.${key}.amount`);
    const category = resolvePresetCategory(key, categories);

    return {
      key,
      label,
      amount: amountLabel,
      type,
      preset: { type, name: label, amount, ...(category && { category }) } satisfies QuickAddPreset,
    };
  });

  const openBlankTransaction = () => {
    openWithPreset({ type: 'Expense', name: '' });
  };

  const navigateToImport = () => {
    navigate(ROUTES.IMPORT_URL);
  };

  return (
    <Column spacing={2} alignItems={{ xs: 'center', sm: 'flex-start' }} width="100%">
      <Row spacing={1.5} alignItems="center" width="100%">
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>
          {t('setup.orAddRegular')}
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Row>
      <Row flexWrap="wrap" gap={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {resolvedVariableChips.map(chip => (
          <QuickAddButton
            key={chip.key}
            label={chip.label}
            amount={chip.amount}
            type={chip.type}
            onClick={() => openWithPreset(chip.preset)}
          />
        ))}
        <ButtonBase
          onClick={openBlankTransaction}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
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
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 14, flexShrink: 0 }} />
          <Typography variant="body2" fontWeight={500}>
            {t('setup.newTransaction')}
          </Typography>
        </ButtonBase>
      </Row>
      <Link
        component="button"
        variant="body2"
        color="text.secondary"
        underline="hover"
        onClick={navigateToImport}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
      >
        <FileUploadOutlinedIcon sx={{ fontSize: 16 }} />
        {t('setup.importFile')}
      </Link>
    </Column>
  );
};

export default AddTransactionButtons;
