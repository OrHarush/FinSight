import { Card, CardContent, Typography } from '@mui/material';
import Row from '@/components/layout/Containers/Row';
import Column from '@/components/layout/Containers/Column';
import AccountDetails from '@/pages/Accounts/AccountCard/AccountDetails';
import { AccountDto } from '@/types/Account';
import AccountIcon from '@/components/accounts/AccountIcon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuTriggerButton from '@/components/appCommon/MenuTriggerButton';
import AccountCardMenu from '@/pages/Accounts/AccountCard/AccountCardMenu';

interface AccountCardProps {
  account: AccountDto;
  selectAccount: (account: AccountDto) => void;
}

const AccountCard = ({ account, selectAccount }: AccountCardProps) => {
  const { t } = useTranslation('accounts');
  // const [isTransferDialogOpen, openTransferDialog, closeTransferDialog] = useOpen(false);
  // const [linkedCount, setLinkedCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // const handleDeleteRequest = async () => {
  //   try {
  //     const res = await fetch(`${API_ROUTES.ACCOUNTS}/${account._id}/linked-transactions`);
  //     const data = await res.json();
  //
  //     if (data.success && data.count > 0) {
  //       setLinkedCount(data.count);
  //       openTransferDialog();
  //     } else {
  //       deleteAccount.mutate();
  //     }
  //   } catch (err) {
  //     console.error('Error checking linked transactions', err);
  //     deleteAccount.mutate();
  //   }
  // };

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
          minWidth: '300px',
          width: '100%',
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
              {/*<EditAndDeleteButtons*/}
              {/*  entityType="account"*/}
              {/*  entityName={account.name}*/}
              {/*  onEdit={() => selectAccount(account)}*/}
              {/*  onDelete={handleDeleteRequest}*/}
              {/*  disabledReason={*/}
              {/*    account.isPrimary ? 'Primary accounts cannot be deleted.' : undefined*/}
              {/*  }*/}
              {/*/>*/}
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
      {/*{isTransferDialogOpen && (*/}
      {/*  <TransferDialog*/}
      {/*    open={true}*/}
      {/*    onClose={closeTransferDialog}*/}
      {/*    entityType="account"*/}
      {/*    count={linkedCount}*/}
      {/*    accountId={account._id}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default AccountCard;
