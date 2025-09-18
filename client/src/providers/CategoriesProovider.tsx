import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { API_ROUTES } from '@/constants/APP_ROUTES';
import { AxiosError } from 'axios';
import { CategoryDto } from '@/types/CategoryDto';

interface CategoriesContextValue {
  categories: CategoryDto[];
  isLoading: boolean;
  error: AxiosError<unknown, any> | null;
  refetch: () => void;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useFetch<CategoryDto[]>({
    url: API_ROUTES.CATEGORIES,
  });
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  return (
    <CategoriesContext.Provider value={{  categories, isLoading, error, refetch }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);

  if (!ctx) {
    throw new Error('useCategories must be used within an AccountsProvider');
  }

  return ctx;
};
