import { Typography, alpha, useTheme } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

const SharedWorkspaceMockup = () => {
  const { t } = useTranslation('home');
  const theme = useTheme();

  return (
    <Column spacing={1.5} sx={{ width: '100%' }}>
      <Row justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.secondary' }}>
          {t('landing.how.step04.workspaceName')}
        </Typography>
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
          }}
        >
          <HomeRoundedIcon sx={{ fontSize: '1.15rem' }} />
        </Row>
      </Row>

      <Row justifyContent="space-between" alignItems="center" spacing={1}>
        <Row alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Column alignItems="flex-start" spacing={0} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.primary' }} noWrap>
              {t('landing.how.step04.memberName')}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }} noWrap>
              {t('landing.how.step04.memberEmail')}
            </Typography>
          </Column>
          <Row
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              flexShrink: 0,
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'inherit' }}>
              {t('landing.how.step04.memberInitials')}
            </Typography>
          </Row>
        </Row>

        <Row
          alignItems="center"
          justifyContent="center"
          sx={{
            px: 1,
            py: 0.4,
            borderRadius: 999,
            flexShrink: 0,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          }}
        >
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd' }}>
            {t('landing.how.step04.ownerBadge')}
          </Typography>
        </Row>
      </Row>

      <Column
        spacing={1}
        sx={{ pt: 1.25, borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
          {t('landing.how.step04.inviteLabel')}
        </Typography>

        <Row spacing={0.85} alignItems="stretch" sx={{ width: '100%' }}>
          <Row
            alignItems="center"
            justifyContent="space-between"
            spacing={0.75}
            sx={{
              flex: 1,
              minWidth: 0,
              px: 1.25,
              py: 0.85,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? '#0f1521'
                  : alpha(theme.palette.text.primary, 0.04),
            }}
          >
            <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary' }} noWrap>
              {t('landing.how.step04.emailPlaceholder')}
            </Typography>
            <MailOutlineRoundedIcon sx={{ fontSize: '1.05rem', color: 'text.secondary' }} />
          </Row>

          <Row
            alignItems="center"
            justifyContent="center"
            sx={{
              px: 1.75,
              borderRadius: 1.5,
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: 'inherit' }} noWrap>
              {t('landing.how.step04.inviteButton')}
            </Typography>
          </Row>
        </Row>
      </Column>

      <Row alignItems="center" justifyContent="center" spacing={0.6} sx={{ pt: 0.25 }}>
        <ShareRoundedIcon sx={{ fontSize: '0.95rem', color: 'text.secondary' }} />
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {t('landing.how.step04.footnote')}
        </Typography>
      </Row>
    </Column>
  );
};

export default SharedWorkspaceMockup;
