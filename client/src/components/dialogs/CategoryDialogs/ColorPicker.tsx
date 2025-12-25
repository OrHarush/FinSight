import { useState } from 'react';
import { Box, IconButton, InputLabel, Popover, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import Column from '@/components/layout/Containers/Column';

interface ColorPickerFieldProps {
  name?: string;
  label?: string;
  presetColors?: string[];
}

const defaultPresetColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
];

// Calculate contrast color for text
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const ColorPickerField = ({
  name = 'color',
  label = 'Color',
  presetColors = defaultPresetColors,
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
