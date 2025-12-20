import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { UserDto } from '@/types/User';
import { useFetch } from '@/hooks/useFetch';
import { queryKeys } from '@/constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextValue {
  user: UserDto | null;
  isLoadingUser: boolean;
  token: string | null;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  logout: () => void;
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

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
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
    onError: () => {
      logout();
      setIsLoadingUser(false);
    },
  });

  const loginMutation = useApiMutation<{ token: string; user: UserDto }, { token: string }>({
    method: 'post',
    url: API_ROUTES.AUTH.GOOGLE_LOGIN,
    options: {
      onSuccess: ({ token: jwtToken, user }) => {
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

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, token, loginWithGoogle, logout }}>
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
