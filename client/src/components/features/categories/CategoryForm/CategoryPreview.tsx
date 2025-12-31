import { alpha, Typography, useTheme } from '@mui/material';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Row from '@/components/shared/layout/containers/Row';
import { useState } from 'react';
import CategoryStylePopover from '@/components/features/categories/CategoryForm/CategoryStylePopover';
import { categoryIcons } from '@/constants/CategoryIcons';
import { useFormContext, useWatch } from 'react-hook-form';
import { CategoryFormValues } from '@/types/Category';

const CategoryPreview = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { control } = useFormContext<CategoryFormValues>();

  const name = useWatch({ control, name: 'name' });
  const icon = useWatch({ control, name: 'icon' });
  const color = useWatch({ control, name: 'color' });

  return (
    <>
      <Row
        width={'200px'}
        paddingX={2}
        paddingY={1}
        spacing={1}
        justifyContent={'center'}
        alignItems={'center'}
        alignSelf={'center'}
        sx={{
          borderRadius: '40px',
          border: `2px solid ${alpha(theme.palette.text.primary, 0.12)}`,
          cursor: 'pointer',
          transition: 'all 160ms ease',
          boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.25)}`,
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.4),
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.99)',
          },
        }}
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <CategoryIconFrame color={color} icon={icon} />
        <Typography
          fontWeight={600}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name?.trim() || 'New category'}
        </Typography>
      </Row>
      <CategoryStylePopover
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        icons={categoryIcons}
      />
    </>
  );
};

export default CategoryPreview;
