import { Box, Card, CardContent, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

const KpiCard = ({
  label,
  value,
  hint,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: SvgIconComponent;
  color: string;
}) => (
  <Card
    variant="outlined"
    sx={{
      height: '100%',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: 2,
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: `${color}.50`,
            color: `${color}.main`,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hint}
      </Typography>
    </CardContent>
  </Card>
);

export default KpiCard;
