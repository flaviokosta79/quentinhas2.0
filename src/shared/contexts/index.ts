// Tenant Context
export {
  TenantProvider,
  useTenant,
  useIsTenantContext,
  useTenantSettings,
  useTenantTheme
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
  tenantFallback?: React.ReactNode;
  tenantErrorFallback?: React.ReactNode;
}

export function AppProviders({
  children,
  tenantFallback,
  tenantErrorFallback
}: AppProvidersProps) {
  return React.createElement(
    AuthProvider,
    { children: React.createElement(
      TenantProvider,
      {
        fallback: tenantFallback,
        errorFallback: tenantErrorFallback,
        children: children
      }
    )}
  );
}