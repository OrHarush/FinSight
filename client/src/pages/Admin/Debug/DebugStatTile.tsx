import { Box, Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

interface DebugStatTileProps {
  label: string;
  value: string | number;
}

const DebugStatTile = ({ label, value }: DebugStatTileProps) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 120,
      px: 2,
      py: 1.5,
      borderRadius: 1.5,
      bgcolor: 'action.hover',
    }}
  >
    <Column spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
        {value}
      </Typography>
    </Column>
  </Box>
);

export default DebugStatTile;
