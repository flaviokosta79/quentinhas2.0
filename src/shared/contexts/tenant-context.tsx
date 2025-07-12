import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Tenant } from '../types';
import { 
  extractSubdomain, 
  getCurrentSubdomain, 
  resolveTenantBySlug,
  isTenantDomain 
} from '../../services/tenant/tenant-resolver';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  isTenantDomain: boolean;
  subdomain: string | null;
  refreshTenant: () => Promise<void>;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isTenantDomainState, setIsTenantDomainState] = useState(false);

  const refreshTenant = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentSubdomain = getCurrentSubdomain();
      setSubdomain(currentSubdomain);
      setIsTenantDomainState(!!currentSubdomain);

      if (currentSubdomain) {
        console.log('🏢 Resolvendo tenant para subdomain:', currentSubdomain);
        const resolvedTenant = await resolveTenantBySlug(currentSubdomain);
        
        if (resolvedTenant) {
          console.log('✅ Tenant encontrado:', resolvedTenant.name);
          setTenant(resolvedTenant);
        } else {
          console.log('❌ Tenant não encontrado para:', currentSubdomain);
          setError('Restaurante não encontrado');
          setTenant(null);
        }
      } else {
        console.log('🌐 Domínio principal - sem tenant');
        setTenant(null);
      }
    } catch (err) {
      console.error('❌ Erro ao resolver tenant:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Resolver tenant na inicialização
  useEffect(() => {
    refreshTenant();
  }, []);

  // Escutar mudanças no hostname (para desenvolvimento)
  useEffect(() => {
    const handleLocationChange = () => {
      const newSubdomain = getCurrentSubdomain();
      if (newSubdomain !== subdomain) {
        console.log('🔄 Hostname mudou, recarregando tenant...');
        refreshTenant();
      }
    };

    // Escutar mudanças de URL
    window.addEventListener('popstate', handleLocationChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [subdomain]);

  const contextValue: TenantContextType = {
    tenant,
    isLoading,
    error,
    isTenantDomain: isTenantDomainState,
    subdomain,
    refreshTenant,
    setTenant
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
}

// Hook para verificar se estamos em um domínio de tenant
export function useIsTenantDomain() {
  const { isTenantDomain } = useTenant();
  return isTenantDomain;
}

// Hook para obter apenas o tenant atual
export function useCurrentTenant() {
  const { tenant, isLoading, error } = useTenant();
  return { tenant, isLoading, error };
}

// Hook para obter o subdomain atual
export function useSubdomain() {
  const { subdomain } = useTenant();
  return subdomain;
}

// Hook para ações do tenant
export function useTenantActions() {
  const { refreshTenant, setTenant } = useTenant();
  return { refreshTenant, setTenant };
}

// Hook para configurações do tenant
export function useTenantSettings() {
  const { tenant } = useTenant();
  
  // Configurações padrão se não houver tenant
  const defaultSettings = {
    isOpen: true,
    openingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '16:00', closed: false },
      sunday: { open: '08:00', close: '16:00', closed: false }
    },
    deliveryFee: 5.00,
    minimumOrder: 20.00,
    acceptsOnlinePayment: true,
    acceptsCash: true
  };

  const settings = tenant?.settings || defaultSettings;
  
  // Verificar se o restaurante está aberto baseado no horário atual
  const isRestaurantOpen = () => {
    if (!settings.isOpen) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleLowerCase().substring(0, 3) +
      now.toLocaleLowerCase().substring(3);
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    
    const daySchedule = (settings as any).openingHours?.[dayKey];
    if (daySchedule?.closed) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(daySchedule?.open?.replace(':', '') || '0');
    const closeTime = parseInt(daySchedule?.close?.replace(':', '') || '2359');
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  return {
    settings,
    isRestaurantOpen: isRestaurantOpen()
  };
}