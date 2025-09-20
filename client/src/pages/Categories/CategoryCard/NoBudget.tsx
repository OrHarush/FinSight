import Column from '@/components/Layout/Column';
import { Box, Typography } from '@mui/material';

const NoBudget = () => (
  <Column textAlign={'center'} marginTop={1} spacing={1} sx={{ opacity: 0.5 }}>
    <Box sx={{ height: 6, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)', mt: 0.5 }} />
    <Typography variant="body2" color="text.secondary">
      No limit set
    </Typography>
  </Column>
);

export default NoBudget;
