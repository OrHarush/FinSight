import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import LyraDialog, { BaseDialogProps } from '@/components/dialogs/LyraDialog';
import Column from '@/components/shared/layout/containers/Column';
import { isMobileDevice } from '@/utils/device';

const CONTACT_EMAIL = 'support@lyra-il.com';

const HelpModal = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('user');
  const isMobile = isMobileDevice();
  const faqItems = t('helpModal.faq', { returnObjects: true }) as Array<{
    question: string;
    answer?: string;
    answerMobile?: string;
    answerDesktop?: string;
  }>;

  const resolveAnswer = (item: (typeof faqItems)[number]) => {
    if (item.answerMobile && item.answerDesktop) {
      return isMobile ? item.answerMobile : item.answerDesktop;
    }

    return item.answer ?? '';
  };

  return (
    <LyraDialog
      isOpen={isOpen}
      closeDialog={closeDialog}
      title={t('helpModal.title')}
      titleIcon={HelpOutlineIcon}
      maxWidth="sm"
    >
      <DialogContent sx={{ py: 1 }}>
        <Column spacing={2} sx={{ pt: 1 }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" fontWeight={600}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {resolveAnswer(item)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          <Divider />
          <Button
            variant="text"
            startIcon={<EmailOutlinedIcon />}
            href={`mailto:${CONTACT_EMAIL}`}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('helpModal.contact')}
          </Button>
        </Column>
      </DialogContent>
    </LyraDialog>
  );
};

export default HelpModal;
