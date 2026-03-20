import { Card, Grid, Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const PaymentMethodsSkeleton = () => (
  <Grid container spacing={2}>
    {[1, 2, 3].map(i => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            position: 'relative',
            width: 'clamp(18rem, 92vw, 21.4375rem)',
            aspectRatio: '343 / 216',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          <Column
            padding={2}
            spacing={2}
            sx={{ height: '100%', position: 'relative', zIndex: 1 }}
            justifyContent={'space-between'}
          >
            <Row justifyContent="space-between" alignItems="center">
              <Skeleton variant={'text'} width="160px" height={'42px'} />
              <Skeleton variant={'text'} width="80px" height={'42px'} />
            </Row>
            <Skeleton variant={'text'} width="160px" height={'42px'} />
          </Column>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default PaymentMethodsSkeleton;
