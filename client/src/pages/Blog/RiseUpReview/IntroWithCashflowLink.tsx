import { Typography } from '@mui/material';

import { ROUTES } from '@/constants/Routes';

interface IntroWithCashflowLinkProps {
  intro: string;
}

const LINK_WORD = 'והתזרים';

const inlineLinkSx = {
  color: 'primary.main',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(167,139,250,0.4)',
  transition: 'text-decoration-color 0.2s',
  '&:hover': { textDecorationColor: '#a78bfa' },
} as const;

const IntroWithCashflowLink = ({ intro }: IntroWithCashflowLinkProps) => {
  const idx = intro.indexOf(LINK_WORD);

  if (idx === -1) {
    return (
      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        {intro}
      </Typography>
    );
  }

  return (
    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
      {intro.slice(0, idx)}
      <Typography component="a" href={ROUTES.BLOG_CASHFLOW_GUIDE_URL} sx={inlineLinkSx}>
        {LINK_WORD}
      </Typography>
      {intro.slice(idx + LINK_WORD.length)}
    </Typography>
  );
};

export default IntroWithCashflowLink;
