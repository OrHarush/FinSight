import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FeedbackDialog from '@/components/features/feedback/FeedbackDialog';
import Column from '@/components/shared/layout/containers/Column';
import ThemeToggle from '@/components/shared/layout/sidebar/settings/ThemeToggle';
import UserAvatar from '@/components/shared/layout/sidebar/settings/UserAvatar';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import { useOpen } from '@/hooks/common/useOpen';
import LegalLinks from '@/pages/Login/LegalLinks';

const Settings = () => {
  const { t } = useTranslation('common');
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();
  const { expanded } = useSidebar();

  if (!expanded) {
    return (
      <>
        <Column padding={1} alignItems="center" spacing={1} paddingBottom={2}>
          <ThemeToggle />
          <LanguageSelect menuDirection="up" />
          <UserAvatar />
        </Column>
        {isFeedbackDialogOpen && (
          <FeedbackDialog isOpen={isFeedbackDialogOpen} closeDialog={closeFeedbackDialog} />
        )}
      </>
    );
  }

  return (
    <>
      <Column paddingTop={1} justifyContent={'flex-end'}>
        <Column>
          <ListItem sx={{ pt: 0, pb: 0 }}>
            <ListItemButton
              onClick={openFeedbackDialog}
              sx={{
                borderRadius: '12px',
                color: 'text.secondary',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <FeedbackOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('feedback.title')} />
            </ListItemButton>
          </ListItem>
        </Column>
        <Divider sx={{ mt: 2.5 }} />
        <Column padding={2} spacing={2}>
          <UserAvatar />
          <LegalLinks />
        </Column>
      </Column>
      {isFeedbackDialogOpen && (
        <FeedbackDialog isOpen={isFeedbackDialogOpen} closeDialog={closeFeedbackDialog} />
      )}
    </>
  );
};

export default Settings;
