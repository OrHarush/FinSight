import { Grid } from '@mui/material';
import AccountCardSkeleton from '@/pages/Accounts/AccountCardsSkeleton/AccountCardSkeleton';

const AccountCardsSkeleton = () => (
  <Grid container spacing={3}>
    {Array.from({ length: 3 }).map((_, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
        <AccountCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export default AccountCardsSkeleton;
