import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface GoalsEmptyStateProps {
  onCreate: () => void;
}

const GoalsEmptyState = ({ onCreate }: GoalsEmptyStateProps) => {
  const { t } = useTranslation('goals');

  return (
    <Card sx={{ borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 'none' }}>
      <CardContent sx={{ py: { xs: 5, sm: 7 }, px: 3 }}>
        <Column spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
          <Row
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'action.hover',
            }}
          >
            <TrackChangesIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Row>
          <Typography variant="h6" fontWeight={600}>
            {t('empty.headline')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
            {t('empty.body')}
          </Typography>
          <Button variant="contained" onClick={onCreate}>
            {t('empty.cta')}
          </Button>
        </Column>
      </CardContent>
    </Card>
  );
};

export default GoalsEmptyState;
