interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_DEV_AUTH_BYPASS?: string;
  readonly VITE_EXCLUDE_EMAILS?: string;
  VITE_MAINTENANCE_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.webp';
