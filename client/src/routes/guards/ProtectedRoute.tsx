import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/constants/Routes';
import { isAdmin } from '@/utils/envUtils';

interface GuardProps {
  children: ReactElement;
}

export const RequireAuth = ({ children }: GuardProps): ReactElement => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN_URL} />;
  }

  return children;
};

export const RequireAdmin = ({ children }: GuardProps): ReactElement => {
  const { user } = useAuth();

  if (!isAdmin(user)) {
    return <Navigate to={ROUTES.OVERVIEW_URL} replace />;
  }

  return children;
};

export const RequireGuest = ({ children }: GuardProps): ReactElement => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={ROUTES.OVERVIEW_URL} replace />;
  }

  return children;
};
