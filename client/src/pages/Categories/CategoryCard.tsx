import { Card, CardContent, IconButton, Typography, Box, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Row from '@/components/Layout/Row';
import { SvgIconComponent } from '@mui/icons-material';
import { CategoryDto } from '@/types/CategoryDto';

interface CategoryCardProps {
  category: CategoryDto;
  icon: SvgIconComponent;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CategoryCard = ({ category, icon: Icon, onEdit, onDelete }: CategoryCardProps) => (
  <Grid key={category._id} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
    <Card
      sx={{
        width: '280px',
        borderRadius: '12px',
        paddingX: 2,
        paddingY: 1,
      }}
    >
      <CardContent sx={{ padding: '8px !important' }}>
        <Row alignItems="center" justifyContent="space-between">
          <Row alignItems="center" spacing={2}>
            <Box
              sx={{
                backgroundColor: category.color || 'green',
                borderRadius: '12px',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon />
            </Box>
            <Typography fontWeight={500}>{category.name}</Typography>
          </Row>
          <Row spacing={1}>
            <IconButton onClick={onEdit} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={onDelete} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Row>
        </Row>
      </CardContent>
    </Card>
  </Grid>
);

export default CategoryCard;
