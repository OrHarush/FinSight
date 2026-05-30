import api from './axios';

import { API_ROUTES } from '@/constants/Routes';

const FALLBACK_FILENAME = 'lyra-export.json';

const parseFilename = (disposition: string): string => {
  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(disposition);

  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // fall through to ascii filename
    }
  }

  const asciiMatch = /filename="([^"]+)"/.exec(disposition);

  return asciiMatch?.[1] ?? FALLBACK_FILENAME;
};

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadMyData = async () => {
  const response = await api.get(API_ROUTES.USERS_EXPORT, { responseType: 'blob' });
  const filename = parseFilename(response.headers['content-disposition'] ?? '');

  triggerDownload(response.data, filename);
};

export const downloadWorkspaceData = async (workspaceId: string) => {
  const response = await api.get(API_ROUTES.WORKSPACE_EXPORT(workspaceId), {
    responseType: 'blob',
  });
  const filename = parseFilename(response.headers['content-disposition'] ?? '');

  triggerDownload(response.data, filename);
};
