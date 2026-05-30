import { Box, Paper, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReactNode } from 'react';

import lyraIcon from '@/assets/lyraIcon.webp';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface InvitationLandingShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

const InvitationLandingShell = ({ children, footer }: InvitationLandingShellProps) => {
  const theme = useTheme();

  return (
    <Column
      sx={{
        minHeight: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 4, sm: 6 },
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          backgroundColor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Row
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          }}
        >
          <Box
            component="img"
            src={lyraIcon}
            alt=""
            width={24}
            height={24}
            sx={{ display: 'block' }}
          />
          <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
            Lyra
          </Typography>
        </Row>
        <Column spacing={2.5} sx={{ p: { xs: 3, sm: 3.5 } }}>
          {children}
        </Column>
        {footer}
      </Paper>
    </Column>
  );
};

export default InvitationLandingShell;
