// Tenant Context
export {
  TenantProvider,
  useTenant,
  useIsTenantDomain,
  useCurrentTenant,
  useSubdomain,
  useTenantActions,
  useTenantSettings
} from './tenant-context';

// Auth Context
export {
  AuthProvider,
  useAuth,
  useUserRole,
  usePermissions
} from './auth-context';

// Combined Provider for easy setup
import React from 'react';
import { TenantProvider } from './tenant-context';
import { AuthProvider } from './auth-context';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({
  children
}: AppProvidersProps) {
  return React.createElement(
    AuthProvider,
    { children: React.createElement(
      TenantProvider,
      {
        children: children
      }
    )}
  );
}