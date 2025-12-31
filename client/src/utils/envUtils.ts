import { UserDto } from '@/types/User';

const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS.split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdmin = (user: UserDto | null) =>
  !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
