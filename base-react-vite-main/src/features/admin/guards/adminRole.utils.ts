import { LOCAL_STORAGE_KEYS } from '@shared/constants/storage-key';

export const ADMIN_PORTAL_ROLES = ['ADMIN', 'MANAGER', 'STAFF'] as const;

export const getCurrentAdminRole = (): string | null => {
  return (
    localStorage.getItem('user_role') ||
    localStorage.getItem(LOCAL_STORAGE_KEYS.userRole)
  );
};

export const isAdminPortalRole = (role: string | null | undefined): boolean => {
  if (!role) return false;
  return (ADMIN_PORTAL_ROLES as readonly string[]).includes(role.toUpperCase());
};
