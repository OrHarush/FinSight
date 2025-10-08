import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { API_ROUTES } from '@/constants/Routes';
import { UserDto } from '@/types/User';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setIsLoadingUser(false);
  }, []);

  const loginMutation = useApiMutation<{ token: string; user: UserDto }, { token: string }>({
    method: 'post',
    url: `${API_ROUTES.AUTHENTICATION}/google`,
    options: {
      onSuccess: ({ token: jwtToken, user }) => {
        console.log('Login successful:', { user, jwtToken });
        setUser(user);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', jwtToken);
      },
    },
  });

  const loginWithGoogle = async (googleToken: string) => {
    console.log('Logging in with Google token:', googleToken);
    await loginMutation.mutateAsync({ token: googleToken });
  };

  const logout = () => {
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
