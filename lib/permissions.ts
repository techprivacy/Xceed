import { AdminRole } from '@/types';

// Mirrors backend/src/config/permissions.js — client-side copy is for hiding
// nav items the user can't use, not for enforcement. The API re-checks every
// request with its own copy of this map, so a UI bypass here can't grant
// real access.
export type Permission = 'dashboard' | 'products' | 'directory' | 'news';

const ROLE_PERMISSIONS: Record<Exclude<AdminRole, 'admin'>, Permission[]> = {
  staff: ['dashboard'],
  product_manager: ['dashboard', 'products'],
  directory_manager: ['dashboard', 'directory'],
};

export const ASSIGNABLE_ROLES: Exclude<AdminRole, 'admin'>[] = ['staff', 'product_manager', 'directory_manager'];

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: 'Admin',
  staff: 'Staff',
  product_manager: 'Product Manager',
  directory_manager: 'Directory Manager',
};

export function can(role: AdminRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === 'admin') return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
