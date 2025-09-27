import { SvgIconComponent } from '@mui/icons-material';
import { Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface AccountIconProps {
  icon?: SvgIconComponent;
}

const AccountIcon = ({ icon: Icon = AccountBalanceIcon }: AccountIconProps) => {
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
      <Icon fontSize="medium" />
    </Box>
  );
};

export default AccountIcon;
