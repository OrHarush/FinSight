import Row from '@/components/Layout/Row';
import OverviewCard from '@/pages/Dashboard/GeneralOverview/OverviewCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Overview = () => {
  return (
    <Row direction={{ sm: 'column', md: 'row' }} width={'100%'} justifyContent={'space-between'}>
      <OverviewCard
        headerTitle={'Monthly Income'}
        balance={10000}
        icon={AccountBalanceWalletIcon}
      />
      <OverviewCard headerTitle={'Monthly Expenses'} balance={10000} icon={ReceiptLongIcon} />
      <OverviewCard headerTitle={'Net Income'} balance={10000} icon={AccountBalanceIcon} />
      <OverviewCard headerTitle={'Net Income'} balance={10000} icon={AccountBalanceIcon} />
    </Row>
  );
};

export default Overview;
