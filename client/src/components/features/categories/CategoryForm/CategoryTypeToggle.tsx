import { FormControl, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslation } from 'react-i18next';
import { SvgIconComponent } from '@mui/icons-material';

type CategoryType = 'Expense' | 'Income';

const CATEGORY_TYPES: {
  value: CategoryType;
  icon: SvgIconComponent;
  color: string;
}[] = [
  {
    value: 'Expense',
    icon: TrendingDownIcon,
    color: '#ef4444',
  },
  {
    value: 'Income',
    icon: TrendingUpIcon,
    color: '#22c55e',
  },
];

interface CategoryTypeToggleProps {
  name?: string;
  required?: boolean;
}

const CategoryTypeToggle = ({ name = 'type', required = true }: CategoryTypeToggleProps) => {
  const { t } = useTranslation('categories');
  const { control } = useFormContext();

  return (
    <FormControl component="fieldset" fullWidth>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <ToggleButtonGroup
            {...field}
            exclusive
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 1.2,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  fontWeight: 600,
                },
                ...CATEGORY_TYPES.reduce<Record<string, any>>(
                  (acc, type) => ({
                    ...acc,
                    [`&[value="${type.value}"]`]: {
                      '&:hover': {
                        bgcolor: `${type.color}14`,
                      },
                      '&.Mui-selected': {
                        bgcolor: `${type.color}1F`,
                        borderColor: type.color,
                        color: type.color,
                        '&:hover': {
                          bgcolor: `${type.color}29`,
                        },
                      },
                    },
                  }),
                  {}
                ),
              },
            }}
          >
            {CATEGORY_TYPES.map(({ value, icon: Icon, color }) => (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 20,
                    color: field.value === value ? color : 'inherit',
                  }}
                />
                {t(`options.${value.toLowerCase()}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
    </FormControl>
  );
};

export default CategoryTypeToggle;
