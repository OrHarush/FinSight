import { Box, Card, CardContent, IconButton, Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryCardSkeleton = () => (
  <Card
    sx={{
      width: '260px',
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
              backgroundColor: 'rgba(161,161,161,0.1)',
              borderRadius: '12px',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
          <Skeleton variant="text" width={80} height={24} />
        </Row>
        <Row spacing={1}>
          <IconButton onClick={() => {}} size="small" disabled>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" disabled>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Row>
      </Row>
    </CardContent>
  </Card>
);

export default CategoryCardSkeleton;
