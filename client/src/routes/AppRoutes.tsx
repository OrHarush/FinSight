import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoadingScreen from '@/components/shared/feedback/LoadingScreen';
import AuthenticatedLayout from '@/components/shared/layout/AuthenticatedLayout';
import Column from '@/components/shared/layout/containers/Column';
import PublicLayout from '@/components/shared/layout/PublicLayout';
import { ROUTES } from '@/constants/Routes';
import { useMinLoadingDuration } from '@/hooks/common/useMinLoadingDuration';
import Accounts from '@/pages/Accounts';
import { AdminKpiDashboard } from '@/pages/Admin';
import Budgets from '@/pages/Budgets';
import Categories from '@/pages/Categories';
import Chat from '@/pages/Chat';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFoundPage';
import Overview from '@/pages/Overview';
import PaymentMethods from '@/pages/PaymentMethods';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import { Transactions } from '@/pages/Transactions';
import { useAuth } from '@/providers/AuthProvider';
import { RequireAdmin, RequireAuth, RequireGuest } from '@/routes/guards/ProtectedRoute';

const AppRoutes = () => {
  const { user, isLoadingUser } = useAuth();
  const showLoading = useMinLoadingDuration(isLoadingUser, 1500);

  if (showLoading) {
    return (
      <Column height={'100vh'}>
        <LoadingScreen />
      </Column>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path={ROUTES.TERMS_OF_SERVICE_URL} element={<TermsOfServicePage />} />
          <Route path={ROUTES.PRIVACY_POLICY_URL} element={<PrivacyPolicyPage />} />
          <Route
            element={
              <RequireGuest>
                <PublicLayout />
              </RequireGuest>
            }
          >
            <Route path={ROUTES.HOME_URL} element={<HomePage />} />
            <Route path={ROUTES.LOGIN_URL} element={<LoginPage />} />
            <Route path="/" element={<Navigate to={ROUTES.HOME_URL} />} />
            <Route path="*" element={<NotFoundPage isAuthenticated={!!user} />} />
          </Route>
          <Route
            element={
              <RequireAuth>
                <AuthenticatedLayout />
              </RequireAuth>
            }
          >
            <Route path={ROUTES.OVERVIEW_URL} element={<Overview />} />
            <Route path={ROUTES.TRANSACTIONS_URL} element={<Transactions />} />
            <Route path={ROUTES.ACCOUNTS_URL} element={<Accounts />} />
            <Route path={ROUTES.CATEGORIES_URL} element={<Categories />} />
            <Route path={ROUTES.PAYMENT_METHODS_URL} element={<PaymentMethods />} />
            <Route
              path={ROUTES.ADMIN_KPIS_URL}
              element={
                <RequireAdmin>
                  <AdminKpiDashboard />
                </RequireAdmin>
              }
            />
            <Route path={ROUTES.BUDGETS_URL} element={<Budgets />} />
            <Route path={ROUTES.CHAT_URL} element={<Chat />} />
            {/*<Route path={ROUTES.PLANNER_URL} element={<Planner />} />*/}
            {/*<Route path={ROUTES.REPORTS_URL} element={<Reports />} />*/}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
