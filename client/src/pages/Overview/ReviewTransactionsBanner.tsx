import CloseIcon from '@mui/icons-material/Close';
import { alpha, IconButton, Theme, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Row from '@/components/shared/layout/containers/Row';
import { ROUTES } from '@/constants/Routes';
import { useReviewCount } from '@/hooks/entities/useTransactionReview';
import { useAuth } from '@/providers/AuthProvider';

const DISMISS_KEY = 'lyra_review_banner_dismissed';

const ReviewTransactionsBanner = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useReviewCount(!!user);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === 'true'
  );

  const count = data?.count ?? 0;

  if (dismissed || count === 0) {
    return null;
  }

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  const goToReview = () => {
    navigate(ROUTES.TRANSACTIONS_REVIEW_URL);
  };

  return (
    <Row
      sx={{
        borderRadius: 2,
        py: { xs: 2, sm: 1.5 },
        px: { xs: 2, sm: 2.5 },
        bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
        border: '1px solid',
        borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.15),
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Typography variant="body1" fontWeight={600} sx={{ flex: 1, minWidth: 0 }}>
        {t('review.banner.title', { count })}{' '}
        <Typography
          component="span"
          variant="body1"
          color="primary"
          onClick={goToReview}
          sx={{
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {t('review.banner.cta')}
        </Typography>
      </Typography>
      <IconButton
        size="small"
        onClick={dismiss}
        aria-label={t('review.banner.dismiss')}
        sx={{ color: 'text.secondary', flexShrink: 0, mt: -0.5, '&:hover': { color: 'text.primary' } }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Row>
  );
};

export default ReviewTransactionsBanner;
