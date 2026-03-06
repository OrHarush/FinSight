import { SvgIconComponent } from '@mui/icons-material';
import { Box } from '@mui/material';
import * as Icons from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface AccountIconProps {
  icon?: string;
}

const AccountIcon = ({ icon = 'AccountBalanceIcon' }: AccountIconProps) => {
  const IconComponent = (Icons as Record<string, SvgIconComponent>)[icon] || AccountBalanceIcon;

  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        backgroundColor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <IconComponent />
    </Box>
  );
};

export default AccountIcon;
