import { Box } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { bankAccountIconMap } from '@/constants/BankAccountIcons';

interface AccountIconProps {
  icon?: string;
}

const AccountIcon = ({ icon = 'AccountBalance' }: AccountIconProps) => {
  const IconComponent = (icon && bankAccountIconMap[icon]) || AccountBalanceIcon;

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
