import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AccountIcon from '@/components/features/accounts/AccountIcon';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import MenuTriggerButton from '@/components/shared/ui/MenuTriggerButton';
import AccountCardMenu from '@/pages/Accounts/components/AccountCard/AccountCardMenu';
import AccountDetails from '@/pages/Accounts/components/AccountCard/AccountDetails';
import { AccountDto } from '@/types/Account';

interface AccountCardProps {
  account: AccountDto;
  selectAccount: (account: AccountDto) => void;
}

const AccountCard = ({ account, selectAccount }: AccountCardProps) => {
  const { t } = useTranslation('accounts');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Card
        onClick={() => selectAccount(account)}
        sx={{
          width: '100%',
          minWidth: '240px',
          maxWidth: '400px',
          height: '240px',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          border: account.isPrimary ? '2px solid' : '1px solid',
          borderColor: account.isPrimary ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
            transform: 'translateY(-2px)',
            borderColor: 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Column spacing={2}>
            <Row justifyContent="space-between" alignItems="center">
              <Row alignItems="center" justifyContent={'space-between'} spacing={2}>
                <AccountIcon icon={account.icon} />
                <Column>
                  <Typography fontWeight={700}>{account.name}</Typography>
                  {account.isPrimary && (
                    <Typography variant={'body2'} color={'primary'}>
                      {t('details.primary')}
                    </Typography>
                  )}
                </Column>
              </Row>
              <MenuTriggerButton openMenu={handleMenuOpen} />
            </Row>
            <AccountDetails account={account} />
          </Column>
        </CardContent>
      </Card>
      <AccountCardMenu
        account={account}
        open={open}
        handleMenuClose={handleMenuClose}
        anchorEl={anchorEl}
      />
    </>
  );
};

export default AccountCard;
