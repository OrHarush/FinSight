import { Box, Card, CardContent, Grid, IconButton, Skeleton } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryCardSkeleton = () => (
  <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Card
      sx={{
        width: '280px',
        height: '80px',
        borderRadius: '12px',
        paddingX: 2,
        paddingY: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ height: '100%', padding: '8px !important' }}>
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
          <IconButton size="small" color="error" disabled>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Row>
      </CardContent>
    </Card>
  </Grid>
);

export default CategoryCardSkeleton;
