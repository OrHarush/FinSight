import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Divider, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import {
  getCopyButtonStyle,
  getDividerStyle,
  getOpenBadgeStyle,
  getOpenHintStyle,
  getOpenInBrowserBoxStyle,
  getPrimaryButtonStyle,
  getUrlTextStyle,
} from '@/pages/Login/styles';
import { isAndroidDevice } from '@/utils/device';

const COPIED_FEEDBACK_MS = 2000;

const buildChromeIntentUrl = (): string =>
  `intent://${window.location.host}${window.location.pathname}` +
  '#Intent;scheme=https;package=com.android.chrome;end';

const InAppBrowserNotice = () => {
  const { t } = useTranslation('login');
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.origin;
  const displayUrl = window.location.host;

  const openInChrome = () => {
    window.location.href = buildChromeIntentUrl();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
    } catch {
      // clipboard can be undefined or throw inside the in-app WebView; the copy fallback is best-effort
    }

    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <Column spacing={2}>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
        {t('inapp_banner')}
      </Typography>

      {isAndroidDevice() ? (
        <>
          <Button
            variant="contained"
            onClick={openInChrome}
            startIcon={<OpenInNewIcon />}
            sx={getPrimaryButtonStyle()}
          >
            {t('inapp_open_chrome')}
          </Button>
          <Typography variant="caption" sx={{ color: '#c7d2fe', textAlign: 'center' }}>
            {t('inapp_open_chrome_note')}
          </Typography>

          <Divider sx={getDividerStyle()}>{t('or')}</Divider>

          <Row sx={getOpenHintStyle()}>
            <Typography variant="caption">{t('inapp_open_hint')}</Typography>
            <MoreVertIcon sx={{ fontSize: '1.1rem' }} />
          </Row>
        </>
      ) : (
        <>
          <Row sx={getOpenInBrowserBoxStyle()}>
            <Row sx={getOpenBadgeStyle()}>
              <MoreVertIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
            </Row>
            <Column spacing={0.25} alignItems="flex-start">
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                {t('inapp_open_title')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#c7d2fe' }}>
                {t('inapp_open_hint')}
              </Typography>
            </Column>
          </Row>

          <Divider sx={getDividerStyle()}>{t('or')}</Divider>

          <Button
            variant="outlined"
            onClick={copyLink}
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            sx={getCopyButtonStyle()}
          >
            {copied ? t('inapp_copied') : t('inapp_copy')}
          </Button>

          <Typography variant="caption" sx={getUrlTextStyle()}>
            {displayUrl}
          </Typography>
        </>
      )}
    </Column>
  );
};

export default InAppBrowserNotice;
