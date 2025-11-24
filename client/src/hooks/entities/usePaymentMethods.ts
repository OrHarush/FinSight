import { API_ROUTES } from '@/constants/Routes';
import { queryKeys } from '@/constants/queryKeys';
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '@/providers/AuthProvider';
import { PaymentMethodDto } from '@/types/PaymentMethod';

export const usePaymentMethods = () => {
  const { user } = useAuth();

  const query = useFetch<PaymentMethodDto[]>({
    url: API_ROUTES.PAYMENT_METHODS,
    queryKey: queryKeys.paymentMethods(),
    enabled: !!user,
  });

  const paymentMethods = query.data
    ? [...query.data].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
    : [];

  const primaryPaymentMethod = paymentMethods.find(({ isPrimary }) => isPrimary);

  return {
    ...query,
    paymentMethods: query.data ?? [],
    primaryPaymentMethod,
  };
};
