import { Card, CardContent, Chip, Typography, Grid } from '@mui/material';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import AccountIcon from '@/components/features/accounts/AccountIcon';
import { AccountDto } from '@/types/Account';
import { useTranslation } from 'react-i18next';

interface ChatAccountCardsProps {
  accounts: AccountDto[];
}

const ChatAccountCards = ({ accounts }: ChatAccountCardsProps) => {
  const { t } = useTranslation('chat');

  return (
    <Grid container spacing={1} sx={{ mt: 0.5 }}>
      {accounts.map(account => (
        <Grid key={account._id} size={{ xs: 12, sm: 6 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: account.isPrimary ? 'primary.main' : 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Row alignItems="center" spacing={1.5}>
                <AccountIcon icon={account.icon} />
                <Column spacing={0.25}>
                  <Row alignItems="center" spacing={0.75}>
                    <Typography variant="body2" fontWeight={600}>
                      {account.name}
                    </Typography>
                    {account.isPrimary && (
                      <Chip
                        label={t('badges.primary')}
                        size="small"
                        color="primary"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    )}
                  </Row>
                  <Typography variant="caption" color="text.secondary">
                    {account.institution}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.main">
                    ${account.balance.toLocaleString()}
                  </Typography>
                </Column>
              </Row>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatAccountCards;
