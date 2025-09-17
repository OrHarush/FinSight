import { Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import Row from '@/components/Layout/Row';
import Column from '@/components/Layout/Column';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AccountDto } from '@/types/Account';

interface AccountCardProps {
  account: AccountDto;
}

const AccountCard = ({ account }: AccountCardProps) => (
  <Grid>
    <Card key={account._id} sx={{ width: '360px', maxHeight: '300px' }}>
      <CardContent sx={{ padding: 4, height: '100%' }}>
        <Column justifyContent={'space-between'} height={'100%'} spacing={1}>
          <Row justifyContent={'space-between'}>
            <Row alignItems={'center'} spacing={1}>
              <AccountBalanceIcon />
              <Typography fontWeight={900}>{account.name}</Typography>
            </Row>
            <Row>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon color={'error'} />
              </IconButton>
            </Row>
          </Row>
          <Row justifyContent={'space-between'}>
            <Typography variant={'body2'} fontWeight={100}>
              Opening Balance:
            </Typography>
            <Typography>{account.balance}</Typography>
          </Row>
          <Row justifyContent={'space-between'}>
            <Typography variant={'body2'} fontWeight={100}>
              Institution:
            </Typography>
            <Typography>{account.institution}</Typography>
          </Row>
          <Row justifyContent={'space-between'}>
            <Typography variant={'body2'} fontWeight={100}>
              Account Number:
            </Typography>
            <Typography>{account.accountNumber}</Typography>
          </Row>
          <Row justifyContent={'space-between'}>
            <Typography variant={'body2'} fontWeight={100}>
              Last Synced:
            </Typography>
            <Typography>
              {account.lastSynced
                ? new Date(account.lastSynced).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Not synced yet'}
            </Typography>
          </Row>
        </Column>
      </CardContent>
    </Card>
  </Grid>
);

export default AccountCard;
