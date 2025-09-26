import { Avatar, Typography } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import Row from '@/components/Layout/Containers/Row';
import Column from '@/components/Layout/Containers/Column';

const UserAvatar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Row alignItems={'center'} spacing={1}>
      <Avatar
        src={user.picture}
        alt={user.name}
        sx={{ width: 44, height: 44, border: '2px solid #9c88ff' }}
      />
      <Column>
        <Typography variant={'body2'}>Signed in as </Typography>
        <Typography variant={'body2'} fontWeight={600}>
          {user.email}
        </Typography>
      </Column>
    </Row>
  );
};

export default UserAvatar;
