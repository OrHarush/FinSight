import api from './axios';

import { API_ROUTES } from '@/constants/Routes';

export const downloadFullBackup = async () => {
  const response = await api.get(API_ROUTES.ADMIN_BACKUP, { responseType: 'blob' });

  const disposition = response.headers['content-disposition'] ?? '';
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? 'lyra-backup.zip';

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
