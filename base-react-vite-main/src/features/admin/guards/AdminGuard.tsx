import type { FC, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import tokenManager from '@shared/utils/tokenManager';
import { ADMIN_PATHS } from '@shared/constants/path';
import { Forbidden403Page } from './Forbidden403Page';
import { getCurrentAdminRole, isAdminPortalRole } from './adminRole.utils';

export const AdminGuard: FC = () => {
  const token = tokenManager.getAccessToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = getCurrentAdminRole();
  if (!isAdminPortalRole(role)) {
    return <Forbidden403Page />;
  }

  if (role === 'STAFF' && location.pathname === ADMIN_PATHS.DASHBOARD) {
    return <Navigate to={ADMIN_PATHS.BOOKINGS} replace />;
  }

  return <Outlet />;
};

export interface RoleRouteGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export const RoleRouteGuard: FC<RoleRouteGuardProps> = ({ allowedRoles, children }) => {
  const role = getCurrentAdminRole();
  if (!role || !allowedRoles.includes(role)) {
    return <Forbidden403Page />;
  }
  return <>{children}</>;
};

export default AdminGuard;
