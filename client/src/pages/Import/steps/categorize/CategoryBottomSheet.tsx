import {
  alpha,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Row from '@/components/shared/layout/containers/Row';
import { CategoryDto } from '@/types/Category';

interface CategoryBottomSheetProps {
  open: boolean;
  categories: CategoryDto[];
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}

const CategoryBottomSheet = ({
  open,
  categories,
  onSelect,
  onClose,
}: CategoryBottomSheetProps) => {
  const { t } = useTranslation('transactions');
  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '70vh',
          pb: 2,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 4,
          bgcolor: theme.palette.divider,
          borderRadius: 2,
          mx: 'auto',
          mt: 1.5,
          mb: 2,
        }}
      />
      <Typography variant="subtitle2" fontWeight={600} px={2} pb={1}>
        {t('fields.category')}
      </Typography>
      <List disablePadding>
        {categories.map(cat => (
          <ListItemButton
            key={cat._id}
            onClick={() => {
              onSelect(cat._id);
              onClose();
            }}
            sx={{
              px: 2,
              py: 1.25,
              '&:hover': { bgcolor: alpha(cat.color, 0.06) },
            }}
          >
            <Row spacing={1.5} alignItems="center">
              <CategoryIconFrame color={cat.color} icon={cat.icon} />
              <ListItemText primary={cat.name} primaryTypographyProps={{ variant: 'body2' }} />
            </Row>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default CategoryBottomSheet;
