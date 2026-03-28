import { UserDto } from '@/types/User';

export const isAdmin = (user: UserDto | null): boolean => user?.role === 'admin';
