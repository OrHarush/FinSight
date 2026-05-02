import { useMutation } from '@tanstack/react-query';

import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const useExportTransactions = () =>
  useMutation({
    mutationFn: async (month: string) => {
      const res = await api.get<Blob>(API_ROUTES.TRANSACTIONS_EXPORT(month), {
        responseType: 'blob',
      });

      triggerDownload(res.data, `lyra-transactions-${month}.xlsx`);
    },
  });
