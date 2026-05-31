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
