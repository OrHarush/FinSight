import Dashboard from '@/pages/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import Planner from '@/pages/Planner';
import Reports from '@/pages/Reports';
import Accounts from '@/pages/Accounts/accounts';
import AppLayout from '@/components/Layout/AppLayout';
import Categories from '@/pages/Categories';
import { Transactions } from '@/pages/Transactions';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={APP_ROUTES.DASHBOARD_URL} element={<Dashboard />} />
        <Route path={APP_ROUTES.TRANSACTIONS_URL} element={<Transactions />} />
        <Route path={APP_ROUTES.CATEGORIES_URL} element={<Categories />} />
        <Route path={APP_ROUTES.PLANNER_URL} element={<Planner />} />
        <Route path={APP_ROUTES.REPORTS_URL} element={<Reports />} />
        <Route path={APP_ROUTES.ACCOUNTS_URL} element={<Accounts />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
