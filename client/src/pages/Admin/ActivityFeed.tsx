import { Avatar, Box, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AnalyticsEventType } from '@/types/Admin';

import { FormattedActivity } from './useAdminAnalytics';

const EVENT_BADGE_COLOR: Record<AnalyticsEventType, 'success' | 'info' | 'warning' | 'secondary' | 'primary'> = {
  transaction_created: 'success',
  recurring_created: 'info',
  csv_imported: 'warning',
  category_customized: 'secondary',
  onboarding_completed: 'primary',
};

interface ActivityFeedProps {
  items: FormattedActivity[];
}

const ActivityFeed = ({ items }: ActivityFeedProps) => {
  const { t } = useTranslation('admin');

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('recent.empty')}
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <Box key={`${item.userId}-${item.createdAt}`}>
          <ListItem sx={{ px: 2.5, py: 1.25 }}>
            <ListItemAvatar sx={{ minWidth: 44 }}>
              <Avatar
                src={item.userAvatar || undefined}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 13,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                {item.initials}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {item.userName}
                </Typography>
              }
              secondary={
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
                  {item.formattedTime}
                </Typography>
              }
            />

            <Chip
              label={t(`recent.event.${item.event}`)}
              size="small"
              color={EVENT_BADGE_COLOR[item.event]}
              variant="outlined"
              sx={{ fontSize: 11, height: 24, fontWeight: 500 }}
            />
          </ListItem>

          {index < items.length - 1 && <Divider variant="inset" component="li" />}
        </Box>
      ))}
    </List>
  );
};

export default ActivityFeed;
