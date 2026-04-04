import { alpha, Chip, Paper, Typography, useTheme } from '@mui/material';

import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import Row from '@/components/shared/layout/containers/Row';
import { CategoryDto } from '@/types/Category';

interface CategoryCardProps {
  category: CategoryDto;
  name: string;
  assignedCount: number;
  isOver: boolean;
  onClick: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
}

const CategoryCard = ({
  category,
  name,
  assignedCount,
  isOver,
  onClick,
  onDragEnter,
  onDragLeave,
  onDrop,
}: CategoryCardProps) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      variant="outlined"
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onDragLeave();
        }
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        onDrop();
      }}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        borderRadius: 2,
        border: isOver
          ? `2px solid ${category.color}`
          : `1px solid ${theme.palette.divider}`,
        backgroundColor: isOver ? alpha(category.color, 0.08) : 'background.paper',
        transition: 'all 0.1s ease',
        '&:hover': {
          borderColor: category.color,
          backgroundColor: alpha(category.color, 0.04),
        },
      }}
    >
      <Row spacing={1.5} alignItems="center" justifyContent="space-between">
        <Row spacing={1.5} alignItems="center" minWidth={0}>
          <CategoryIconFrame color={category.color} icon={category.icon} />
          <Typography variant="body2" noWrap>
            {name}
          </Typography>
        </Row>
        {assignedCount > 0 && (
          <Chip
            label={assignedCount}
            size="small"
            sx={{
              bgcolor: category.color,
              color: '#fff',
              fontWeight: 600,
              minWidth: 24,
              flexShrink: 0,
            }}
          />
        )}
      </Row>
    </Paper>
  );
};

export default CategoryCard;
