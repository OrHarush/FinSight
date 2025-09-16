import Column from '@/components/Layout/Column';
import FinancialHighlights from '@/pages/Dashboard/FinancialHighlights';
import BalanceTrend from '@/pages/Dashboard/BalanceTrend';
import RecentTransactions from '@/pages/Dashboard/RecentTransactions';
import DashboardHeader from '@/pages/Dashboard/DashboardHeader';
import Row from '@/components/Layout/Row';
import AccountsView from '@/pages/Dashboard/AccountsView';

const Dashboard = () => (
  <Column height="100%" width={'1200px'} spacing={4} alignSelf={'center'}>
    <DashboardHeader />
    <Column height={'100%'} width={'100%'} spacing={4}>
      <FinancialHighlights />
      <Row width={'100%'} spacing={4}>
        <Column width={'100%'} spacing={4}>
          <BalanceTrend />
          <RecentTransactions />
        </Column>
        <AccountsView />
      </Row>
    </Column>
  </Column>
);

export default Dashboard;
