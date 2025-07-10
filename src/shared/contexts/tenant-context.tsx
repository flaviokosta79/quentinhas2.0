import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Tenant } from '../types';
import { resolveCurrentTenant, clearTenantCache } from '../../services/tenant/tenant-resolver';
import { loadTenantTheme } from '../../services/theme/theme-service';
import { ERROR_MESSAGES } from '../constants';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
  clearCache: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export function TenantProvider({ children, fallback, errorFallback }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTenant = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const resolvedTenant = await resolveCurrentTenant();
      setTenant(resolvedTenant);
      
      // Apply tenant theme if available
      if (resolvedTenant?.theme) {
        await loadTenantTheme(resolvedTenant.id, resolvedTenant.theme);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.TENANT_NOT_FOUND;
      setError(errorMessage);
      console.error('Error loading tenant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    await loadTenant();
  };

  const clearCache = () => {
    clearTenantCache();
    if (tenant) {
      clearTenantCache(tenant.slug);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const contextValue: TenantContextType = {
    tenant,
    isLoading,
    error,
    refreshTenant,
    clearCache
  };

  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  if (error && errorFallback) {
    return <>{errorFallback}</>;
  }

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Hook for checking if we're in a tenant context
export function useIsTenantContext(): boolean {
  const { tenant } = useTenant();
  return tenant !== null;
}

// Hook for getting tenant settings with defaults
export function useTenantSettings() {
  const { tenant } = useTenant();
  
  return {
    settings: tenant?.settings || {
      restaurantName: 'Restaurante',
      deliveryTime: '30-45 min',
      location: '',
      isOpen: true,
      deliveryFee: 5.00,
      minimumOrder: 15.00,
      paymentMethods: ['pix', 'cartao'],
      workingHours: {
        monday: { open: '08:00', close: '22:00', isOpen: true },
        tuesday: { open: '08:00', close: '22:00', isOpen: true },
        wednesday: { open: '08:00', close: '22:00', isOpen: true },
        thursday: { open: '08:00', close: '22:00', isOpen: true },
        friday: { open: '08:00', close: '22:00', isOpen: true },
        saturday: { open: '08:00', close: '22:00', isOpen: true },
        sunday: { open: '08:00', close: '22:00', isOpen: false }
      }
    },
    isRestaurantOpen: () => {
      if (!tenant?.settings) return true;
      
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      const daySchedule = tenant.settings.workingHours[dayName];
      if (!daySchedule || !daySchedule.isOpen) return false;
      
      return currentTime >= daySchedule.open && currentTime <= daySchedule.close;
    }
  };
}

// Hook for getting tenant theme
export function useTenantTheme() {
  const { tenant } = useTenant();
  
  return {
    theme: tenant?.theme || {
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFD23F',
        background: '#FFFFFF'
      },
      logo: '',
      fonts: {
        primary: 'Inter',
        secondary: 'Inter'
      }
    },
    hasCustomTheme: !!tenant?.theme
  };
}