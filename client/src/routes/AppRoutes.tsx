import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoadingScreen from '@/components/shared/feedback/LoadingScreen';
import AuthenticatedLayout from '@/components/shared/layout/AuthenticatedLayout';
import Column from '@/components/shared/layout/containers/Column';
import PublicLayout from '@/components/shared/layout/PublicLayout';
import { ROUTES } from '@/constants/Routes';
import { useMinLoadingDuration } from '@/hooks/common/useMinLoadingDuration';
import Accounts from '@/pages/Accounts';
import { AdminDashboard } from '@/pages/Admin';
import AdminDebugPage from '@/pages/Admin/Debug';
import Budgets from '@/pages/Budgets';
import Categories from '@/pages/Categories';
import Chat from '@/pages/Chat';
import Goals from '@/pages/Goals';
import GoalDetail from '@/pages/Goals/GoalDetail';
import HomePage from '@/pages/Home';
import ImportWizardPage from '@/pages/Import/ImportWizardPage';
import LegalPage from '@/pages/LegalPage/LegalPage';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFoundPage';
import Overview from '@/pages/Overview';
import PaymentMethods from '@/pages/PaymentMethods';
import { Transactions } from '@/pages/Transactions';
import { useAuth } from '@/providers/AuthProvider';
import { RequireAdmin, RequireAuth, RequireGuest } from '@/routes/guards/ProtectedRoute';

const ANALYTICS_EXCLUDED_EMAILS = new Set([
  'orharush24@gmail.com',
  'finsight.dev@gmail.com',
  'orrh2410@gmail.com',
  'orharush@mail.tau.ac.il',
]);

const AppRoutes = () => {
  const { user, isLoadingUser } = useAuth();

  const hasStoredToken =
    !!localStorage.getItem('token') || import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
  const showLoading = useMinLoadingDuration(isLoadingUser, 1500, hasStoredToken);

  const trackAnalytics =
    user?.analyticsConsent === 'accepted' &&
    !ANALYTICS_EXCLUDED_EMAILS.has(user.email);

  if (showLoading) {
    return (
      <Column height={'100vh'}>
        <LoadingScreen />
      </Column>
    );
  }

  return (
    <BrowserRouter>
      {trackAnalytics && <Analytics />}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route
              path={ROUTES.TERMS_OF_SERVICE_URL}
              element={<LegalPage type="termsOfService" />}
            />
            <Route path={ROUTES.PRIVACY_POLICY_URL} element={<LegalPage type="privacyPolicy" />} />
            <Route path={ROUTES.ACCESSIBILITY_URL} element={<LegalPage type="accessibility" />} />
          </Route>
          <Route
            element={
              <RequireGuest>
                <PublicLayout />
              </RequireGuest>
            }
          >
            <Route path={ROUTES.HOME_URL} element={<HomePage />} />
            <Route path={ROUTES.LOGIN_URL} element={<LoginPage />} />
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
            <Route path={ROUTES.IMPORT_URL} element={<ImportWizardPage />} />
            <Route path={ROUTES.ACCOUNTS_URL} element={<Accounts />} />
            <Route path={ROUTES.CATEGORIES_URL} element={<Categories />} />
            <Route path={ROUTES.PAYMENT_METHODS_URL} element={<PaymentMethods />} />
            <Route
              path={ROUTES.ADMIN_KPIS_URL}
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path={ROUTES.ADMIN_DEBUG_URL}
              element={
                <RequireAdmin>
                  <AdminDebugPage />
                </RequireAdmin>
              }
            />
            <Route path={ROUTES.BUDGETS_URL} element={<Budgets />} />
            <Route path={ROUTES.GOALS_URL} element={<Goals />} />
            <Route path={ROUTES.GOAL_DETAIL_URL} element={<GoalDetail />} />
            <Route
              path={ROUTES.CHAT_URL}
              element={
                <RequireAdmin>
                  <Chat />
                </RequireAdmin>
              }
            />
            {/*<Route path={ROUTES.PLANNER_URL} element={<Planner />} />*/}
            {/*<Route path={ROUTES.REPORTS_URL} element={<Reports />} />*/}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
