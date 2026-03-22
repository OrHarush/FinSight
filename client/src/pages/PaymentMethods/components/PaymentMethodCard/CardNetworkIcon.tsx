import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Box } from '@mui/material';

interface CardNetworkIconProps {
  name?: string;
}

type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'generic';

const detectNetwork = (name?: string): CardNetwork => {
  if (!name) {
    return 'generic';
  }

  const lower = name.toLowerCase();

  if (lower.includes('visa')) {
    return 'visa';
  }

  if (lower.includes('master')) {
    return 'mastercard';
  }

  if (lower.includes('amex') || lower.includes('american express')) {
    return 'amex';
  }

  return 'generic';
};

const renderVisaIcon = () => (
  <Box
    component="span"
    sx={{
      fontFamily: '"Times New Roman", serif',
      fontStyle: 'italic',
      fontWeight: 900,
      fontSize: '0.9rem',
      color: '#1a1f71',
      background: 'white',
      borderRadius: '3px',
      px: 0.75,
      py: 0.125,
      lineHeight: 1.4,
      letterSpacing: -0.5,
      display: 'inline-block',
    }}
  >
    VISA
  </Box>
);

const renderMastercardIcon = () => (
  <Box sx={{ position: 'relative', width: 36, height: 22, flexShrink: 0 }}>
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        backgroundColor: '#EB001B',
        position: 'absolute',
        left: 0,
      }}
    />
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        backgroundColor: '#F79E1B',
        position: 'absolute',
        left: 14,
        opacity: 0.9,
      }}
    />
  </Box>
);

const renderAmexIcon = () => (
  <Box
    component="span"
    sx={{
      fontFamily: 'Arial, sans-serif',
      fontWeight: 700,
      fontSize: '0.6rem',
      color: 'white',
      background: '#016FD0',
      borderRadius: '3px',
      px: 0.5,
      py: 0.25,
      letterSpacing: 0.5,
      lineHeight: 1.4,
      display: 'inline-block',
    }}
  >
    AMEX
  </Box>
);

const CardNetworkIcon = ({ name }: CardNetworkIconProps) => {
  const network = detectNetwork(name);

  if (network === 'visa') {
    return renderVisaIcon();
  }

  if (network === 'mastercard') {
    return renderMastercardIcon();
  }

  if (network === 'amex') {
    return renderAmexIcon();
  }

  return <CreditCardIcon sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 22 }} />;
};

export default CardNetworkIcon;
