import { Card, Grid, Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

import { CARD_HEIGHT } from './PaymentMethodCard/styles';

const PaymentMethodsSkeleton = () => (
  <Grid container spacing={2}>
    {[1, 2, 3].map(i => (
      <Column key={i} width={'100%'} spacing={1.5}>
        <Skeleton variant="text" width={60} />
        <Grid container spacing={2}>
          {[1, 2].map(i => (
            <Grid size={{ xs: 12, sm: 4, md: 3 }} key={i}>
              <Card
                sx={{
                  height: CARD_HEIGHT,
                  width: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '0.5px solid',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width={28}
                  height={28}
                  sx={{ position: 'absolute', top: 8, right: 8, borderRadius: 2 }}
                />
                <Row sx={{ px: 2, py: 1.25, height: '100%' }} alignItems="center" spacing={1.5}>
                  <Skeleton
                    variant="rounded"
                    width={44}
                    height={44}
                    sx={{ borderRadius: '10px', flexShrink: 0 }}
                  />
                  <Column spacing={0.5} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="55%" height={18} />
                    <Skeleton variant="text" width="35%" height={14} />
                  </Column>
                </Row>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Column>
    ))}
  </Grid>
);

export default PaymentMethodsSkeleton;
