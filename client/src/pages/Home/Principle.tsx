import { alpha, Grid, Typography, useTheme } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import { JSX } from 'react';

interface PrincipleProps {
  label: string;
  icon: JSX.Element;
}

const Principle = ({ label, icon }: PrincipleProps) => {
  const theme = useTheme();

  return (
    <Grid
      sx={{
        width: '190px',
        px: 3,
        py: 1.5,
        borderRadius: 10,
        display: 'flex',
        directionL: 'row',
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Row alignItems="center" spacing={1}>
        <Column
          sx={{
            color: theme.palette.primary.main,
            '& svg': { fontSize: 24 },
          }}
        >
          {icon}
        </Column>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {label}
        </Typography>
      </Row>
    </Grid>
  );
};

export default Principle;
