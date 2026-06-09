import axios, { AxiosResponse } from 'axios';

import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ShortcutStatus {
  connected: boolean;
  connectedAt: string;
}

export interface ShortcutConnectionState {
  connected: boolean;
  connectedAt: string | null;
}

export interface ShortcutInit {
  code: string;
}

interface ShortcutTokenReady {
  success: true;
  data: { token: string };
}

interface ShortcutTokenPending {
  success: true;
  status: 'pending';
}

export type ShortcutTokenResult = ShortcutTokenReady | ShortcutTokenPending;

/**
 * The shared `api` instance overwrites Authorization with the session Bearer token and
 * redirects to /login on 401. The status check is authed with the shortcut token and must
 * treat 401 as "not connected", so it uses a bare axios call that bypasses both behaviors.
 */
export const getShortcutStatus = async (shortcutToken: string): Promise<ShortcutStatus> => {
  const response = await axios.get<ApiEnvelope<ShortcutStatus>>(
    `${import.meta.env.VITE_API_URL}${API_ROUTES.SHORTCUT.STATUS}`,
    { headers: { Authorization: `Shortcut ${shortcutToken}` } }
  );

  return response.data.data;
};

export const initShortcut = async (): Promise<ShortcutInit> => {
  const response = await api.post<ApiEnvelope<ShortcutInit>>(API_ROUTES.SHORTCUT.INIT);

  return response.data.data;
};

export const approveShortcut = async (code: string): Promise<void> => {
  await api.post(API_ROUTES.SHORTCUT.APPROVE, { code });
};

export const pollShortcutToken = (
  code: string
): Promise<AxiosResponse<ShortcutTokenResult>> =>
  api.get(`${API_ROUTES.SHORTCUT.TOKEN}?code=${encodeURIComponent(code)}`);

export const revokeShortcut = async (): Promise<void> => {
  await api.delete(API_ROUTES.SHORTCUT.REVOKE);
};

export const getShortcutConnectionState = async (): Promise<ShortcutConnectionState> => {
  const response = await api.get<ApiEnvelope<ShortcutConnectionState>>(
    API_ROUTES.SHORTCUT.CONNECTION
  );

  return response.data.data;
};

const MACRO_FALLBACK_FILENAME = 'Lyra.macrodroid';

const parseMacroFilename = (disposition: string): string => {
  const asciiMatch = /filename="([^"]+)"/.exec(disposition);

  return asciiMatch?.[1] ?? MACRO_FALLBACK_FILENAME;
};

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadShortcutMacro = async (): Promise<void> => {
  const response = await api.get(API_ROUTES.SHORTCUT.MACRO, { responseType: 'blob' });
  const filename = parseMacroFilename(response.headers['content-disposition'] ?? '');

  triggerDownload(response.data, filename);
};
