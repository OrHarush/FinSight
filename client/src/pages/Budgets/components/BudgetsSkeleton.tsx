import { Card, CardContent, Skeleton } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const BudgetsSkeleton = () => (
  <Column spacing={2}>
    {Array.from({ length: 5 }).map((_, idx) => (
      <Card
        key={idx}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
          <Row spacing={2}>
            <Column flex={1} spacing={0.75}>
              <Row spacing={2} alignItems="center">
                <Skeleton variant="rounded" width={40} height={40} />
                <Column spacing={0.5} flex={1}>
                  <Skeleton variant="text" width="45%" height={28} />
                  <Skeleton variant="text" width="40%" height={22} />
                </Column>
              </Row>
              <Row spacing={1} alignItems="center" width="100%">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={10}
                  sx={{ flex: 1, borderRadius: 3 }}
                />
                {/*<Skeleton variant="rounded" width={52} height={24} />*/}
              </Row>
              <Skeleton variant="text" width={90} height={20} />
            </Column>
            <Row alignItems="center" justifyContent="center" spacing={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </Row>
          </Row>
        </CardContent>
      </Card>
    ))}
  </Column>
);

export default BudgetsSkeleton;
