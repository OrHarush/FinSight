import RemoveIcon from '@mui/icons-material/Remove';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCategoryDTO, CreateCategorySchema, PRESET_COLORS } from '@lyra/shared';
import { Box, Button, Drawer, IconButton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import QuickColorPicker from '@/components/features/categories/QuickColorPicker';
import QuickIconPicker from '@/components/features/categories/QuickIconPicker';
import TextInput from '@/components/shared/inputs/TextInput';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { ApiResponse } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';
import { CategoryDto } from '@/types/Category';

const QUICK_COLORS = PRESET_COLORS.slice(0, 6);

const QUICK_ICONS: Record<string, string[]> = {
  Expense: ['ShoppingCart', 'DirectionsCar', 'Restaurant', 'LocalHospital', 'Home'],
  Income: ['AttachMoney', 'AccountBalance', 'TrendingUp', 'Work', 'CardGiftcard'],
};

const getVisibleColors = (quickColors: readonly string[], selected: string) => {
  if (quickColors.includes(selected)) {
    return quickColors;
  }

  return [...quickColors.slice(0, -1), selected];
};

const getVisibleIcons = (quickIcons: string[], selected: string) => {
  if (quickIcons.includes(selected)) {
    return quickIcons;
  }

  return [...quickIcons.slice(0, -1), selected];
};

interface CreateCategoryBottomSheetProps {
  open: boolean;
  transactionType: 'Expense' | 'Income';
  onClose: () => void;
  onCreated: (category: CategoryDto) => void;
}

const CreateCategoryBottomSheet = ({
  open,
  transactionType,
  onClose,
  onCreated,
}: CreateCategoryBottomSheetProps) => {
  const { t } = useTranslation('categories');
  const theme = useTheme();
  const [showFullColors, setShowFullColors] = useState(false);
  const [showFullIcons, setShowFullIcons] = useState(false);

  const quickIcons = QUICK_ICONS[transactionType] ?? QUICK_ICONS.Expense;

  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string>(quickIcons[0]);

  const methods = useForm<CreateCategoryDTO>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      color: PRESET_COLORS[0],
      icon: quickIcons[0],
      type: transactionType,
    },
    mode: 'onSubmit',
  });

  const { setError, reset, watch } = methods;
  const nameValue = watch('name');

  const createCategory = useApiMutation<ApiResponse<CategoryDto>, CreateCategoryDTO>({
    method: 'post',
    url: API_ROUTES.CATEGORIES,
    queryKeysToInvalidate: [queryKeys.categories()],
  });

  const resetState = () => {
    reset();
    setSelectedColor(PRESET_COLORS[0]);
    setSelectedIcon(quickIcons[0]);
    setShowFullColors(false);
    setShowFullIcons(false);
  };

  const dismissSheet = () => {
    if (showFullColors || showFullIcons) {
      setShowFullColors(false);
      setShowFullIcons(false);

      return;
    }

    resetState();
    onClose();
  };

  const submitCategory = async (data: CreateCategoryDTO) => {
    const payload = { ...data, color: selectedColor, icon: selectedIcon };

    try {
      const result = await createCategory.mutateAsync(payload);
      resetState();
      onCreated(result.data);
    } catch (err: unknown) {
      const isDuplicate =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 409;

      if (isDuplicate) {
        setError('name', { message: t('messages.duplicateName') });
      }
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={dismissSheet}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            pb: 3,
            px: 2.5,
          },
        },
      }}
      sx={{ zIndex: theme.zIndex.modal + 1 }}
    >
      <Box
        sx={{
          width: 36,
          height: 4,
          bgcolor: 'divider',
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
        }}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitCategory)} noValidate>
          <Column spacing={2.5}>
            <TextInput
              name="name"
              label={t('fields.name')}
              placeholder={t('fields.namePlaceholder')}
              required
            />

            <Column spacing={1}>
              <Row alignItems="center" justifyContent="space-between">
                <Typography variant="body2" fontWeight={600}>
                  {t('fields.color')}
                </Typography>
                {showFullColors && (
                  <IconButton
                    type="button"
                    size="small"
                    onClick={() => setShowFullColors(false)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </Row>
              <QuickColorPicker
                colors={getVisibleColors(QUICK_COLORS, selectedColor)}
                selected={selectedColor}
                expanded={showFullColors}
                onSelect={setSelectedColor}
                onExpand={() => setShowFullColors(true)}
              />
            </Column>
            <Column spacing={1}>
              <Row alignItems="center" justifyContent="space-between">
                <Typography variant="body2" fontWeight={600}>
                  {t('fields.icon')}
                </Typography>
                {showFullIcons && (
                  <IconButton
                    type="button"
                    size="small"
                    onClick={() => setShowFullIcons(false)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </Row>
              <QuickIconPicker
                icons={getVisibleIcons(quickIcons, selectedIcon)}
                selected={selectedIcon}
                expanded={showFullIcons}
                onSelect={setSelectedIcon}
                onExpand={() => setShowFullIcons(true)}
              />
            </Column>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!nameValue?.trim() || createCategory.isPending}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, fontSize: '1rem' }}
            >
              {t('actions.create')}
            </Button>
          </Column>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default CreateCategoryBottomSheet;
