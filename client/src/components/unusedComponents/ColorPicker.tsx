import { useState } from 'react';
import { Box, IconButton, InputLabel, Popover, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import Column from '@/components/shared/layout/containers/Column';
import { PRESET_COLORS, PresetColor } from '../../../../shared/types/colors';
import { getContrastColor } from '@/utils/colorUtils';

interface ColorPickerFieldProps {
  name?: string;
  label?: string;
  presetColors?: readonly PresetColor[];
}

const ColorPickerField = ({
  name = 'color',
  label = 'Color',
  presetColors = PRESET_COLORS,
}: ColorPickerFieldProps) => {
  const { t } = useTranslation('categories');
  const { control } = useFormContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const getColorName = (hex: string): string => t(`colors.${hex}`, { defaultValue: hex });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Column spacing={0.5}>
          <InputLabel>{label}</InputLabel>
          <TextField
            value={field.value ? getColorName(field.value) : ''}
            onClick={e => setAnchorEl(e.currentTarget)}
            placeholder={t('fields.selectColor')}
            slotProps={{
              input: {
                readOnly: true,
                sx: { cursor: 'pointer' },
                startAdornment: field.value ? (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      backgroundColor: field.value,
                      border: '1px solid',
                      borderColor: 'divider',
                      flexShrink: 0,
                      mr: 1,
                    }}
                  />
                ) : null,
              },
            }}
            fullWidth
          />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            slotProps={{
              paper: {
                sx: { mt: 0.5 },
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 1,
                }}
              >
                {presetColors.map(color => (
                  <IconButton
                    key={color}
                    onClick={() => {
                      field.onChange(color);
                      setAnchorEl(null);
                    }}
                    sx={{
                      backgroundColor: color,
                      width: 40,
                      height: 40,
                      border: '2px solid',
                      borderColor: field.value === color ? 'primary.main' : 'transparent',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: color,
                        opacity: 0.9,
                      },
                    }}
                    aria-label={getColorName(color)}
                  >
                    {field.value === color && (
                      <CheckIcon
                        sx={{
                          color: getContrastColor(color),
                          fontSize: 20,
                        }}
                      />
                    )}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Popover>
        </Column>
      )}
    />
  );
};

export default ColorPickerField;
