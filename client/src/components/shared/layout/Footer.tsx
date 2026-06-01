import { alpha, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';

interface FooterLink {
  label: string;
  href: string;
  newTab?: boolean;
}

const Footer = () => {
  const { t } = useTranslation(['home', 'common']);
  const theme = useTheme();

  const links: FooterLink[] = [
    {
      label: t('common:nav.blog'),
      href: ROUTES.BLOG_URL,
    },
    {
      label: t('common:legal.termsOfService'),
      href: ROUTES.TERMS_OF_SERVICE_URL,
      newTab: true,
    },
    {
      label: t('common:legal.privacyPolicy'),
      href: ROUTES.PRIVACY_POLICY_URL,
      newTab: true,
    },
    {
      label: t('common:legal.accessibility'),
      href: ROUTES.ACCESSIBILITY_URL,
      newTab: true,
    },
  ];

  return (
    <Column
      component={'section'}
      alignItems="center"
      spacing={1.5}
      sx={{
        pt: 3,
        position: 'relative',
        zIndex: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
      }}
    >
      <Row spacing={1} flexWrap="wrap" justifyContent="center" sx={{ rowGap: 0.5 }}>
        {links.map((link, index) => (
          <Fragment key={link.label}>
            <Typography
              component="a"
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              variant="caption"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'text.primary' },
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </Typography>
            {index < links.length - 1 && (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                •
              </Typography>
            )}
          </Fragment>
        ))}
      </Row>

      <Typography
        component="a"
        href="mailto:support@lyra-il.com"
        variant="caption"
        sx={{
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { color: 'text.primary' },
          transition: 'color 0.2s',
        }}
      >
        {t('home:footerContact')}
      </Typography>

      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>
        {t('common:legal.footer')}
      </Typography>
    </Column>
  );
};

export default Footer;
