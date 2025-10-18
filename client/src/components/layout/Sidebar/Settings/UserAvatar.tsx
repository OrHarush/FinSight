import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import UserMenu from '@/components/layout/Sidebar/Settings/UserMenu';

const UserAvatar = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) {
    return null;
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        onClick={handleOpenMenu}
        sx={{
          cursor: 'pointer',
          p: 1,
          borderRadius: 2,
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        }}
      >
        <IconButton size="small" sx={{ p: 0 }}>
          <Avatar src={user.picture} alt={user.name} sx={{ border: '2px solid #9c88ff' }} />
        </IconButton>
        <Typography>{user.name}</Typography>
      </Box>
      <UserMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
};

export default UserAvatar;
