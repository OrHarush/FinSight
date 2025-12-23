import { ReactElement, Suspense } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import LoadingScreen from '@/components/common/LoadingScreen';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import { ROUTES } from '@/constants/Routes';
import Overview from '@/pages/Overview';
import { Transactions } from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import Accounts from '@/pages/Accounts';
import LoginPage from '@/pages/Login';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import PublicLayout from '@/components/layout/PublicLayout';
import NotFoundPage from '@/pages/NotFoundPage';
import PaymentMethods from '@/pages/PaymentMethods';
import HomePage from '@/pages/Home';

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth();
  // const [showTerms, setShowTerms] = useState(!user?.acceptedTermsAt);
  //
  // console.log(showTerms);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN_URL} />;
  }

  // const handleAccepted = async () => {
  //   // fetchUser();
  //   setShowTerms(false);
  // };

  return (
    <>
      {/*{showTerms && <TermsDialog open={showTerms} onAccepted={handleAccepted} />}*/}
      {/*{!showTerms && children}*/}
      {children}
    </>
  );
};

const AppRoutes = () => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME_URL} element={<HomePage />} />
            <Route path={ROUTES.LOGIN_URL} element={<LoginPage />} />
            <Route path={ROUTES.TERMS_OF_SERVICE_URL} element={<TermsOfServicePage />} />
            <Route path={ROUTES.PRIVACY_POLICY_URL} element={<PrivacyPolicyPage />} />
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
            {/*<Route path={ROUTES.BUDGET_URL} element={<Budget />} />*/}
            {/*<Route path={ROUTES.PLANNER_URL} element={<Planner />} />*/}
            {/*<Route path={ROUTES.REPORTS_URL} element={<Reports />} />*/}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
