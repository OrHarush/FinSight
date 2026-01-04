import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Skeleton,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import dayjs from 'dayjs';
import { useFetch } from '@/hooks/useFetch';
import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { LoginEventDto } from '@/types/Admin';

const UserActivityList = () => {
  const { data, isLoading } = useFetch<LoginEventDto[]>({
    url: `${API_ROUTES.ADMIN}/activity`,
    queryKey: queryKeys.activity(),
  });

  console.log(data);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recent Login Activity
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3 }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={56} sx={{ mb: 1 }} />
            ))}
          </Box>
        ) : !data || data.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No recent login activity
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {data.map((event, index) => (
              <Box key={`${event.userId}-${event.occurredAt}`}>
                <ListItem sx={{ px: 3, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.soft',
                        color: 'primary.main',
                      }}
                    >
                      <LoginIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600}>
                        {event.username}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Login
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          ·
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(event.occurredAt).format('DD MMM YYYY · HH:mm')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                {index < data.length - 1 && <Divider variant="inset" />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default UserActivityList;
