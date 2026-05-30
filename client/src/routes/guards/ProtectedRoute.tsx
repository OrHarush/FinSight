import { ReactElement } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants/Routes';
import { useAuth } from '@/providers/AuthProvider';
import { isAdmin } from '@/utils/env';

interface GuardProps {
  children: ReactElement;
}

const isSafeInternalPath = (path: string | null): path is string =>
  !!path && path.startsWith('/') && !path.startsWith('//') && !path.includes('://');

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
  const [searchParams] = useSearchParams();

  if (user) {
    const nextParam = searchParams.get('next');
    const target = isSafeInternalPath(nextParam) ? nextParam : ROUTES.OVERVIEW_URL;

    return <Navigate to={target} replace />;
  }

  return children;
};
