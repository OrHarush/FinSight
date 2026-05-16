import api from './axios';

import { API_ROUTES } from '@/constants/Routes';

export const downloadMyData = async () => {
  const response = await api.get(API_ROUTES.USERS_EXPORT, { responseType: 'blob' });

  const disposition = response.headers['content-disposition'] ?? '';
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? 'lyra-export.json';

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
