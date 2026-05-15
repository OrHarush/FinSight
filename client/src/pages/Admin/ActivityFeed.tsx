import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { AnalyticsEventType } from '@/types/Admin';

import { useRecentActivity } from './useRecentActivity';

const EVENT_BADGE_COLOR: Record<AnalyticsEventType, 'success' | 'info' | 'warning' | 'secondary' | 'primary' | 'error'> = {
  transaction_created: 'success',
  transaction_updated: 'primary',
  transaction_deleted: 'error',
  recurring_created: 'info',
  csv_imported: 'warning',
  category_created: 'secondary',
  onboarding_completed: 'primary',
  accepted_terms: 'info',
  goal_created: 'success',
  budget_created: 'success',
  account_created: 'success',
  payment_method_created: 'success',
  user_created: 'info',
  user_deleted: 'error',
};

const ActivityFeed = () => {
  const { t } = useTranslation('admin');
  const { items, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useRecentActivity();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) {
        fetchNextPage();
      }
    }, { rootMargin: '200px' });

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <List disablePadding>
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItem key={i} sx={{ px: 2.5, py: 1.25 }}>
            <ListItemAvatar sx={{ minWidth: 44 }}>
              <Skeleton variant="circular" width={32} height={32} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width={120} />}
              secondary={<Skeleton variant="text" width={80} />}
            />
            <Skeleton variant="rounded" width={64} height={24} />
          </ListItem>
        ))}
      </List>
    );
  }

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
    <>
      <List disablePadding>
        {items.map((item, index) => (
          <Box key={`${item.userName}-${item.createdAt}-${index}`}>
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
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{item.userName}</Typography>
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

      {hasNextPage && (
        <Box
          ref={sentinelRef}
          sx={{ display: 'flex', justifyContent: 'center', py: 2, minHeight: 48 }}
        >
          {isFetchingNextPage && <CircularProgress size={20} />}
        </Box>
      )}
    </>
  );
};

export default ActivityFeed;
