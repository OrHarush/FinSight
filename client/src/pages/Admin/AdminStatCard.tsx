import { Box, Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';

interface BadgeConfig {
  text: string;
  color: string;
}

interface AdminStatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  badge?: BadgeConfig;
}

const AdminStatCard = ({ label, value, sub, badge }: AdminStatCardProps) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      border: 1,
      borderColor: 'divider',
      px: 2,
      py: 1.5,
      minWidth: 0,
    }}
  >
    <Column spacing={0.25}>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>

      <Typography sx={{ fontSize: 26, fontWeight: 500, lineHeight: 1.2 }}>
        {value}
      </Typography>

      {(sub || badge) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 20 }}>
          {badge && (
            <Box
              sx={{
                display: 'inline-flex',
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                bgcolor: `${badge.color}.main`,
                color: `${badge.color}.contrastText`,
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              {badge.text}
            </Box>
          )}

          {sub && (
            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
              {sub}
            </Typography>
          )}
        </Box>
      )}
    </Column>
  </Box>
);

export default AdminStatCard;
