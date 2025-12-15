import { Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import UserAvatar from '@/components/layout/Sidebar/Settings/UserAvatar';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import ThemeToggle from '@/components/layout/Sidebar/Settings/ThemeToggle';
import LanguageSelect from '@/components/common/LanguageSelect';
import LegalLinks from '@/pages/Login/LegalLinks';
import { useIsMobile } from '@/hooks/useIsMobile';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { useOpen } from '@/hooks/useOpen';
import FeedbackDialog from '@/components/dialogs/FeedbackDialog';

const Settings = () => {
  const [isFeedbackDialogOpen, openFeedbackDialog, closeFeedbackDialog] = useOpen();

  const isMobile = useIsMobile();

  return (
    <>
      <Column height={'100%'} justifyContent={'flex-end'}>
        <Column>
          {isMobile && (
            <ListItem>
              <ListItemButton
                onClick={openFeedbackDialog}
                sx={{
                  px: 1.5,
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
            <LanguageSelect />
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
