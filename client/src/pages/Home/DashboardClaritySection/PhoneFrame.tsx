import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import WifiIcon from '@mui/icons-material/Wifi';
import { Box, Typography } from '@mui/material';
import { type ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame = ({ children }: PhoneFrameProps) => (
  <Box
    sx={{
      position: 'relative',
      flexShrink: 0,
      width: '100%',
      maxWidth: 380,
      borderRadius: '48px',
      p: '12px',
      backgroundColor: '#05080d',
      border: '1px solid rgba(148, 163, 184, 0.12)',
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 112,
        height: 28,
        borderRadius: '16px',
        backgroundColor: '#05080d',
        zIndex: 2,
      }}
    />
    <Column
      sx={{
        height: 752,
        borderRadius: '36px',
        backgroundColor: 'background.default',
        px: 1.5,
        pt: 1.25,
        pb: 2,
        overflow: 'hidden',
      }}
    >
      <Row
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1, height: 28, flexShrink: 0 }}
      >
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary' }}>
          9:41
        </Typography>
        <Row spacing={0.5} alignItems="center">
          <SignalCellularAltIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
          <WifiIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
          <BatteryFullIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
        </Row>
      </Row>

      <Box sx={{ mt: 2.5, flexShrink: 0 }}>{children}</Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          alignSelf: 'center',
          width: 130,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(148, 163, 184, 0.3)',
        }}
      />
    </Column>
  </Box>
);

export default PhoneFrame;
