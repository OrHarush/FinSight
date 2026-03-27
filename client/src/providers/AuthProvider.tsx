import { useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { queryKeys } from '@/constants/queryKeys';
import { API_ROUTES } from '@/constants/Routes';
import { useFetch } from '@/hooks/common/useFetch';
import { useApiMutation } from '@/hooks/useApiMutation';
import { UserDto } from '@/types/User';

interface AuthContextValue {
  user: UserDto | null;
  isLoadingUser: boolean;
  token: string | null;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: UserDto) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (
      storedUser &&
      storedToken &&
      storedUser !== 'undefined' &&
      storedToken !== 'undefined' &&
      storedUser !== 'null' &&
      storedToken !== 'null'
    ) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch {
        // Invalid JSON in localStorage, treat as unauthenticated
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoadingUser(false);
      }
    } else {
      setIsLoadingUser(false);
    }
  }, []);

  useFetch<UserDto>({
    url: API_ROUTES.AUTH.ME,
    queryKey: queryKeys.user(),
    enabled: !!token,
    onSuccess: data => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setIsLoadingUser(false);
    },
    onError: error => {
      if (error?.status === 401 || error?.status === 404) {
        logout();
      }
      setIsLoadingUser(false);
    },
  });

  const loginMutation = useApiMutation<{ token: string; user: UserDto }, { token: string }>({
    method: 'post',
    url: API_ROUTES.AUTH.GOOGLE_LOGIN,
    options: {
      onSuccess: ({ token: jwtToken, user }) => {
        // Validate: both token and user must be provided and not undefined/null
        if (!jwtToken || !user) {
          logout();
          return;
        }

        setUser(user);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', jwtToken);
      },
    },
  });

  const loginWithGoogle = async (googleToken: string) => {
    await loginMutation.mutateAsync({ token: googleToken });
  };

  const logout = () => {
    queryClient.clear();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser: UserDto) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, token, loginWithGoogle, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
};
