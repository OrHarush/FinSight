import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface LegalHeaderProps {
  title: string;
  date: string;
  showBackButton?: boolean;
}

const LegalHeader = ({ title, date, showBackButton = false }: LegalHeaderProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <Column spacing={2}>
      <Row spacing={1}>
        {showBackButton && (
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, mb: 2 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="back" edge="start">
              <ArrowBackIcon
                sx={{ transform: theme => (theme.direction === 'rtl' ? 'rotate(180deg)' : 'none') }}
              />
            </IconButton>
          </Box>
        )}
        <Typography component="h1" variant="h4" fontWeight={700}>
          {title}
        </Typography>
      </Row>

      <Row spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('legal.lastUpdated', { date })}
        </Typography>
      </Row>
    </Column>
  );
};

export default LegalHeader;
