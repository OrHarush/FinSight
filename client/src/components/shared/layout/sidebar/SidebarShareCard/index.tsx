import LinkIcon from '@mui/icons-material/Link';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { alpha, Box, IconButton, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import api from '@/api/axios';
import Row from '@/components/shared/layout/containers/Row';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import { LYRA_PUBLIC_URL } from '@/constants/app';
import { API_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from '@/providers/SnackbarProvider';

const WHATSAPP_GREEN = '#25D366';
const TELEGRAM_BLUE = '#3897e0';

const SidebarShareCard = () => {
  const { t } = useTranslation('sidebar');
  const theme = useTheme();
  const { expanded } = useSidebar();
  const { user } = useAuth();
  const { alertSuccess } = useSnackbar();

  if (!expanded) {
    return null;
  }

  const trackShareClick = () => {
    if (user?.analyticsConsent !== 'accepted') {
      return;
    }

    void api.post(API_ROUTES.ANALYTICS_SHARE_CLICK, {}).catch(() => {});
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${t('share.shareText')} ${LYRA_PUBLIC_URL}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    trackShareClick();
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(LYRA_PUBLIC_URL)}&text=${encodeURIComponent(t('share.shareText'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    trackShareClick();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(LYRA_PUBLIC_URL);
      alertSuccess(t('share.linkCopied'));
      trackShareClick();
    } catch {
      // Clipboard API unavailable (HTTP / insecure context) — silent
    }
  };

  const getButtonStyle = (color: string, isNeutral = false) => ({
    flex: 1,
    borderRadius: '8px',
    padding: '8px 0',
    backgroundColor: isNeutral
      ? alpha(theme.palette.text.secondary, 0.08)
      : alpha(color, 0.12),
    border: isNeutral
      ? `0.5px solid ${alpha(theme.palette.text.secondary, 0.15)}`
      : `0.5px solid ${alpha(color, 0.25)}`,
    color: isNeutral ? theme.palette.text.secondary : color,
    '&:hover': {
      backgroundColor: isNeutral
        ? alpha(theme.palette.text.secondary, 0.14)
        : alpha(color, 0.2),
    },
  });

  return (
    <Box
      sx={{
        margin: '8px 12px 0',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: 'action.selected',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          display: 'block',
          marginBottom: '10px',
          color: 'text.primary',
        }}
      >
        {t('share.title')}
      </Typography>

      <Row spacing={0.75}>
        <IconButton
          aria-label={t('share.ariaWhatsApp')}
          onClick={shareToWhatsApp}
          sx={getButtonStyle(WHATSAPP_GREEN)}
        >
          <WhatsAppIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <IconButton
          aria-label={t('share.ariaTelegram')}
          onClick={shareToTelegram}
          sx={getButtonStyle(TELEGRAM_BLUE)}
        >
          <TelegramIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <IconButton
          aria-label={t('share.ariaCopyLink')}
          onClick={copyLink}
          sx={getButtonStyle(theme.palette.text.secondary, true)}
        >
          <LinkIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Row>
    </Box>
  );
};

export default SidebarShareCard;
