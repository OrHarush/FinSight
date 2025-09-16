import Dashboard from '@/pages/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Transactions from '@/pages/Transactions';
import Planner from '@/pages/Planner';
import Reports from '@/pages/Reports';
import Accounts from '@/pages/Accounts/accounts';
import AppLayout from '@/components/Layout/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.DASHBOARD_URL} element={<Dashboard />} />
        <Route path={ROUTES.TRANSACTIONS_URL} element={<Transactions />} />
        <Route path={ROUTES.PLANNER_URL} element={<Planner />} />
        <Route path={ROUTES.REPORTS_URL} element={<Reports />} />
        <Route path={ROUTES.ACCOUNTS_URL} element={<Accounts />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
