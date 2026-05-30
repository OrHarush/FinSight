import { Avatar } from '@mui/material';

import { getInitials } from '@/pages/Invitation/utils/nameUtils';

const LYRA_PURPLE = '#534AB7';

interface InviterAvatarProps {
  name: string;
  picture?: string;
  size?: number;
}

const InviterAvatar = ({ name, picture, size = 64 }: InviterAvatarProps) => (
  <Avatar
    src={picture}
    alt={name}
    sx={{
      width: size,
      height: size,
      backgroundColor: LYRA_PURPLE,
      color: '#ffffff',
      fontWeight: 600,
      fontSize: Math.round(size * 0.38),
    }}
  >
    {getInitials(name)}
  </Avatar>
);

export default InviterAvatar;
