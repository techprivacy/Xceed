// Fixed-role permissions (RBAC "few more named roles" tier, not a full
// admin-editable permission-matrix builder — see requirePermission below).
//
// 'admin' is always a superuser and is intentionally NOT listed here — every
// check short-circuits on role === 'admin' before consulting this map, so
// admin never needs to be kept in sync with new permissions added below.
//
// User & role management itself is deliberately never delegable: no entry
// here grants 'users', and routes/authRoutes.js still gates on the original
// adminOnly middleware rather than requirePermission. Otherwise a custom role
// could edit its own permissions into a superuser.
const PERMISSIONS = ['dashboard', 'products', 'directory', 'news'];

const ROLE_PERMISSIONS = {
  // Legacy default from before this RBAC pass existed. Kept minimal on
  // purpose — staff previously had no access to any adminOnly route at all.
  staff: ['dashboard'],
  product_manager: ['dashboard', 'products'],
  directory_manager: ['dashboard', 'directory'],
};

// Roles selectable in the admin "Users & Roles" UI (admin itself is assigned
// implicitly and isn't offered as a dropdown choice you'd hand out casually).
const ASSIGNABLE_ROLES = ['staff', 'product_manager', 'directory_manager'];

module.exports = { PERMISSIONS, ROLE_PERMISSIONS, ASSIGNABLE_ROLES };
