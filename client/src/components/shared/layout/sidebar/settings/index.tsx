import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import FeedbackDialog from '@/components/features/feedback/FeedbackDialog';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import ThemeToggle from '@/components/shared/layout/sidebar/settings/ThemeToggle';
import UserAvatar from '@/components/shared/layout/sidebar/settings/UserAvatar';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useOpen } from '@/hooks/common/useOpen';
import LegalLinks from '@/pages/Login/LegalLinks';

const Settings = () => {
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();
  const isMobile = useIsMobile();
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
      <Column paddingTop={2} justifyContent={'flex-end'}>
        <Column>
          {isMobile && (
            <ListItem sx={{ pt: 0 }}>
              <ListItemButton
                onClick={openFeedbackDialog}
                sx={{
                  borderRadius: 1,
                  color: 'text.secondary',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <FeedbackOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Send feedback" />
              </ListItemButton>
            </ListItem>
          )}
          <Row
            spacing={1}
            sx={{ padding: '0px 16px 16px 16px' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <ThemeToggle />
            <LanguageSelect menuDirection={'up'} />
          </Row>
        </Column>
        <Divider />
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
