import Dashboard from '@/pages/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import Planner from '@/pages/Planner';
import Reports from '@/pages/Reports';
import Accounts from '@/pages/Accounts';
import AppLayout from '@/components/Layout/AppLayout';
import Categories from '@/pages/Categories';
import { Transactions } from '@/pages/Transactions';
import Budget from '@/pages/Budget';
import LoginPage from '@/pages/Login';
import { useAuth } from '@/providers/AuthProvider';
import { ReactElement } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import NotFound from '@/components/NotFound';

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to={ROUTES.LOGIN_URL} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route
      element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }
    >
      <Route path={ROUTES.DASHBOARD_URL} element={<Dashboard />} />
      <Route path={ROUTES.TRANSACTIONS_URL} element={<Transactions />} />
      <Route path={ROUTES.CATEGORIES_URL} element={<Categories />} />
      <Route path={ROUTES.BUDGET_URL} element={<Budget />} />
      <Route path={ROUTES.PLANNER_URL} element={<Planner />} />
      <Route path={ROUTES.REPORTS_URL} element={<Reports />} />
      <Route path={ROUTES.ACCOUNTS_URL} element={<Accounts />} />
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD_URL} />} />
    </Route>
    <Route path={ROUTES.LOGIN_URL} element={<LoginPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
