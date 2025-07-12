# 🚀 Guia de Implementação - SaaS Multi-Tenant

## 📋 Visão Geral

Este documento detalha a implementação passo-a-passo da transformação do projeto em um SaaS B2B2C multi-tenant, incluindo todos os arquivos que precisam ser criados, modificados e a ordem de implementação.

## 🎯 Fases de Implementação

### Fase 1: Estrutura Base e Tipos
### Fase 2: Serviços Core
### Fase 3: Context Providers
### Fase 4: Reestruturação de Componentes
### Fase 5: Aplicações por Contexto
### Fase 6: Migração do Banco

## 📁 Nova Estrutura de Arquivos

```
src/
├── apps/                        # Aplicações por contexto
│   ├── restaurant/             # Storefront do restaurante
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   ├── restaurant-admin/       # Painel do restaurante
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   ├── admin/                  # Super admin
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   ├── landing/                # Landing page
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── onboarding/             # Cadastro de restaurantes
│       ├── components/
│       ├── pages/
│       └── hooks/
├── shared/                     # Componentes compartilhados
│   ├── components/
│   │   ├── ui/                 # shadcn/ui (migrados)
│   │   ├── forms/
│   │   ├── layout/
│   │   └── common/
│   ├── hooks/
│   │   ├── use-tenant.ts
│   │   ├── use-theme.ts
│   │   ├── use-auth.ts
│   │   └── use-restaurant.ts
│   ├── contexts/
│   │   ├── tenant-context.tsx
│   │   ├── theme-context.tsx
│   │   └── auth-context.tsx
│   ├── utils/
│   │   ├── tenant.ts
│   │   ├── theme.ts
│   │   └── validation.ts
│   ├── types/
│   │   ├── tenant.ts
│   │   ├── user.ts
│   │   ├── restaurant.ts
│   │   ├── product.ts
│   │   └── order.ts
│   └── constants/
│       ├── plans.ts
│       ├── themes.ts
│       └── routes.ts
├── services/                   # Serviços de negócio
│   ├── tenant/
│   │   ├── tenant-resolver.ts
│   │   ├── tenant-service.ts
│   │   └── tenant-cache.ts
│   ├── restaurant/
│   │   ├── restaurant-service.ts
│   │   ├── menu-service.ts
│   │   └── order-service.ts
│   ├── auth/
│   │   ├── auth-service.ts
│   │   ├── permissions.ts
│   │   └── roles.ts
│   ├── theme/
│   │   ├── theme-service.ts
│   │   ├── theme-generator.ts
│   │   └── theme-validator.ts
│   └── billing/
│       ├── billing-service.ts
│       ├── subscription-service.ts
│       └── stripe-service.ts
├── lib/                        # Utilitários core
│   ├── utils.ts               # Mantido
│   ├── validations.ts
│   ├── constants.ts
│   └── config.ts
└── integrations/               # Integrações externas
    ├── supabase/
    │   ├── client.ts          # Modificado
    │   ├── types.ts           # Modificado
    │   ├── migrations/
    │   └── seeds/
    ├── stripe/
    │   ├── client.ts
    │   └── webhooks.ts
    └── analytics/
        └── client.ts
```

## 🔧 Arquivos a Serem Criados

### 1. Tipos TypeScript

#### `src/shared/types/tenant.ts`
```typescript
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  settings: TenantSettings;
  theme: TenantTheme;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  restaurantName: string;
  deliveryTime: string;
  location: string;
  isOpen: boolean;
  deliveryFee: number;
  minimumOrder: number;
  paymentMethods: string[];
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
}

export interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground?: string;
    muted?: string;
  };
  logo: string;
  favicon?: string;
  fonts: {
    primary: string;
    secondary: string;
  };
  customCSS?: string;
  layout?: {
    headerStyle: 'default' | 'minimal' | 'centered';
    footerStyle: 'default' | 'minimal' | 'hidden';
  };
}

export interface TenantCreateInput {
  slug: string;
  name: string;
  email: string;
  phone?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  settings?: Partial<TenantSettings>;
  theme?: Partial<TenantTheme>;
}
```

#### `src/shared/types/user.ts`
```typescript
export interface User {
  id: string;
  tenantId: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer';
  profile: UserProfile;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

export interface AuthUser extends User {
  tenant: Tenant;
}
```

#### `src/shared/types/product.ts`
```typescript
export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  maxSelections: number;
  minSelections: number;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  ingredients: string[];
  nutritionalInfo: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuentinhaSize {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

#### `src/shared/types/order.ts`
```typescript
export interface Order {
  id: string;
  tenantId: string;
  customerId?: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      complement?: string;
    };
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  customizations: {
    size: QuentinhaSize;
    selectedItems: {
      categoryId: string;
      categoryName: string;
      items: {
        productId: string;
        productName: string;
      }[];
    }[];
  };
}
```

### 2. Serviços Core

#### `src/services/tenant/tenant-resolver.ts`
```typescript
import { supabase } from '@/integrations/supabase/client';
import { Tenant } from '@/shared/types/tenant';

export class TenantResolver {
  private static cache = new Map<string, Tenant>();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutos

  static async resolveTenant(hostname: string): Promise<Tenant | null> {
    const subdomain = this.extractSubdomain(hostname);
    
    if (!subdomain || subdomain === 'www') {
      return null; // Landing page
    }
    
    // Casos especiais para aplicações internas
    if (['admin', 'app'].includes(subdomain)) {
      return this.createInternalTenant(subdomain);
    }
    
    // Verificar cache
    const cacheKey = `tenant:${subdomain}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    try {
      // Buscar tenant no banco
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', subdomain)
        .eq('status', 'active')
        .single();
      
      if (error || !tenant) {
        console.warn(`Tenant não encontrado: ${subdomain}`, error);
        return null;
      }
      
      // Adicionar ao cache
      this.cache.set(cacheKey, tenant);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      
      return tenant;
    } catch (error) {
      console.error('Erro ao resolver tenant:', error);
      return null;
    }
  }
  
  private static extractSubdomain(hostname: string): string | null {
    // Remove porta se existir
    const cleanHostname = hostname.split(':')[0];
    const parts = cleanHostname.split('.');
    
    // Para desenvolvimento local
    if (cleanHostname.includes('localhost') || cleanHostname.includes('127.0.0.1')) {
      return parts[0] !== 'localhost' ? parts[0] : null;
    }
    
    // Para produção
    if (parts.length >= 3) {
      return parts[0];
    }
    
    return null;
  }
  
  private static createInternalTenant(type: string): Tenant {
    return {
      id: type,
      slug: type,
      name: type === 'admin' ? 'Super Admin' : 'Onboarding',
      email: `${type}@quentinhas.com`,
      status: 'active',
      plan: 'enterprise',
      settings: {
        restaurantName: type === 'admin' ? 'Super Admin' : 'Onboarding',
        deliveryTime: '0 min',
        location: 'Sistema',
        isOpen: true,
        deliveryFee: 0,
        minimumOrder: 0,
        paymentMethods: [],
        workingHours: {}
      },
      theme: this.getDefaultTheme(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  private static getDefaultTheme() {
    return {
      colors: {
        primary: '#FF6B35',
        secondary: '#E63946',
        accent: '#F77F00',
        background: '#FFFFFF'
      },
      logo: '/assets/logo-quentinhas.jpg',
      fonts: {
        primary: 'Inter',
        secondary: 'Inter'
      }
    };
  }
  
  static clearCache() {
    this.cache.clear();
  }
}
```

#### `src/services/theme/theme-service.ts`
```typescript
import { TenantTheme } from '@/shared/types/tenant';

export class ThemeService {
  private static appliedTheme: TenantTheme | null = null;
  
  static applyTheme(theme: TenantTheme) {
    if (this.appliedTheme && JSON.stringify(this.appliedTheme) === JSON.stringify(theme)) {
      return; // Tema já aplicado
    }
    
    const root = document.documentElement;
    
    // Aplicar cores
    Object.entries(theme.colors).forEach(([key, value]) => {
      const hslValue = this.hexToHsl(value);
      root.style.setProperty(`--${key}`, hslValue);
    });
    
    // Aplicar fontes
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);
    
    // Aplicar favicon
    if (theme.favicon) {
      this.updateFavicon(theme.favicon);
    }
    
    // Aplicar CSS customizado
    if (theme.customCSS) {
      this.injectCustomCSS(theme.customCSS);
    }
    
    // Atualizar título da página
    document.title = `${document.title.split(' - ')[0]} - Quentinhas`;
    
    this.appliedTheme = theme;
  }
  
  private static hexToHsl(hex: string): string {
    // Remover # se existir
    hex = hex.replace('#', '');
    
    // Converter para RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }
  
  private static updateFavicon(faviconUrl: string) {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    link.href = faviconUrl;
  }
  
  private static injectCustomCSS(css: string) {
    const existingStyle = document.getElementById('tenant-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'tenant-custom-css';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }
  
  static resetTheme() {
    const root = document.documentElement;
    
    // Remover propriedades customizadas
    const customProperties = [
      '--primary', '--secondary', '--accent', '--background',
      '--font-primary', '--font-secondary'
    ];
    
    customProperties.forEach(prop => {
      root.style.removeProperty(prop);
    });
    
    // Remover CSS customizado
    const customStyle = document.getElementById('tenant-custom-css');
    if (customStyle) {
      customStyle.remove();
    }
    
    this.appliedTheme = null;
  }
}
```

### 3. Context Providers

#### `src/shared/contexts/tenant-context.tsx`
```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Tenant } from '@/shared/types/tenant';
import { TenantResolver } from '@/services/tenant/tenant-resolver';
import { ThemeService } from '@/services/theme/theme-service';
import { supabase } from '@/integrations/supabase/client';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initializeTenant = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const hostname = window.location.hostname;
      const resolvedTenant = await TenantResolver.resolveTenant(hostname);
      
      if (resolvedTenant) {
        setTenant(resolvedTenant);
        
        // Aplicar tema
        ThemeService.applyTheme(resolvedTenant.theme);
        
        // Configurar contexto Supabase para RLS
        if (resolvedTenant.id !== 'admin' && resolvedTenant.id !== 'app') {
          await supabase.rpc('set_current_tenant_id', {
            tenant_id: resolvedTenant.id
          });
        }
      } else {
        // Tenant não encontrado - pode ser landing page ou erro
        const subdomain = hostname.split('.')[0];
        if (subdomain && subdomain !== 'www' && !hostname.includes('localhost')) {
          setError('Restaurante não encontrado');
        }
      }
    } catch (err) {
      console.error('Erro ao inicializar tenant:', err);
      setError('Erro ao carregar restaurante');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshTenant = async () => {
    TenantResolver.clearCache();
    await initializeTenant();
  };
  
  useEffect(() => {
    initializeTenant();
  }, []);
  
  // Limpar tema ao desmontar
  useEffect(() => {
    return () => {
      ThemeService.resetTheme();
    };
  }, []);
  
  const value: TenantContextType = {
    tenant,
    isLoading,
    error,
    refreshTenant
  };
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};
```

### 4. Hooks Customizados

#### `src/shared/hooks/use-restaurant.ts`
```typescript
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category, Product } from '@/shared/types/product';
import { useTenant } from '@/shared/contexts/tenant-context';

export const useRestaurant = () => {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();
  
  // Buscar categorias
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!tenant?.id && tenant.id !== 'admin' && tenant.id !== 'app'
  });
  
  // Buscar produtos
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError
  } = useQuery({
    queryKey: ['products', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!tenant?.id && tenant.id !== 'admin' && tenant.id !== 'app'
  });
  
  // Agrupar produtos por categoria
  const productsByCategory = categories?.reduce((acc, category) => {
    acc[category.id] = products?.filter(p => p.categoryId === category.id) || [];
    return acc;
  }, {} as Record<string, Product[]>) || {};
  
  return {
    categories: categories || [],
    products: products || [],
    productsByCategory,
    isLoading: categoriesLoading || productsLoading,
    error: categoriesError || productsError
  };
};
```

### 5. Roteamento Multi-App

#### `src/App.tsx` (Modificado)
```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TenantProvider } from "@/shared/contexts/tenant-context";
import { AppRouter } from "@/components/AppRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <AppRouter />
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

#### `src/components/AppRouter.tsx`
```typescript
import { Routes, Route } from "react-router-dom";
import { useTenant } from "@/shared/contexts/tenant-context";
import { LoadingScreen } from "@/shared/components/common/LoadingScreen";
import { ErrorScreen } from "@/shared/components/common/ErrorScreen";

// Importar aplicações
import { RestaurantApp } from "@/apps/restaurant/RestaurantApp";
import { AdminApp } from "@/apps/admin/AdminApp";
import { OnboardingApp } from "@/apps/onboarding/OnboardingApp";
import { LandingApp } from "@/apps/landing/LandingApp";

export const AppRouter = () => {
  const { tenant, isLoading, error } = useTenant();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <ErrorScreen error={error} />;
  }
  
  // Determinar qual aplicação carregar baseado no tenant
  if (!tenant) {
    // Landing page
    return <LandingApp />;
  }
  
  switch (tenant.id) {
    case 'admin':
      return <AdminApp />;
    case 'app':
      return <OnboardingApp />;
    default:
      // Aplicação do restaurante
      return <RestaurantApp tenant={tenant} />;
  }
};
```

## 🗄️ Migração do Banco de Dados

### Arquivos SQL a serem criados:

#### `supabase/migrations/001_create_multi_tenant_schema.sql`
- Schema completo multi-tenant
- Tabelas: tenants, users, categories, products, orders, subscriptions
- Índices para performance
- Row Level Security (RLS)
- Políticas de isolamento

#### `supabase/migrations/002_migrate_existing_data.sql`
- Criar tenant padrão "quentinhas-express"
- Migrar dados hardcoded para o banco
- Criar categorias e produtos baseados no código atual
- Configurar tema padrão

#### `supabase/seeds/001_sample_data.sql`
- Dados de exemplo para desenvolvimento
- Múltiplos tenants de teste
- Produtos variados
- Usuários de exemplo

## 🧪 Testes

### Arquivos de teste a serem criados:

#### `src/services/__tests__/tenant-resolver.test.ts`
- Testes de resolução de subdomínio
- Cache de tenants
- Casos especiais (admin, app)

#### `src/services/__tests__/theme-service.test.ts`
- Aplicação de temas
- Conversão de cores
- CSS customizado

#### `src/shared/hooks/__tests__/use-restaurant.test.ts`
- Carregamento de dados
- Agrupamento por categoria
- Estados de loading/error

## 📦 Dependências Adicionais

### Instalar via npm/bun:
```bash
# Validação
bun add zod

# Utilitários
bun add lodash-es date-fns
bun add -D @types/lodash-es

# Testes
bun add -D vitest @testing-library/react @testing-library/jest-dom

# Stripe (futuro)
bun add stripe @stripe/stripe-js

# Analytics (futuro)
bun add @vercel/analytics
```

## 🚀 Ordem de Implementação

### Etapa 1: Tipos e Estrutura Base
1. Criar estrutura de pastas
2. Definir tipos TypeScript
3. Configurar constantes e utilitários

### Etapa 2: Serviços Core
1. TenantResolver
2. ThemeService
3. Serviços de dados (restaurant, auth)

### Etapa 3: Context Providers
1. TenantProvider
2. Hooks customizados
3. Integração com Supabase

### Etapa 4: Roteamento
1. AppRouter
2. Aplicações por contexto
3. Migração de componentes existentes

### Etapa 5: Banco de Dados
1. Executar migrações
2. Migrar dados existentes
3. Configurar RLS

### Etapa 6: Testes e Validação
1. Testes unitários
2. Testes de integração
3. Validação manual

## 📋 Checklist de Implementação

### Preparação
- [ ] Documentação aprovada
- [ ] Estrutura de pastas criada
- [ ] Dependências instaladas
- [ ] Ambiente de desenvolvimento configurado

### Desenvolvimento
- [ ] Tipos TypeScript criados
- [ ] Serviços core implementados
- [ ] Context providers configurados
- [ ] Roteamento multi-app funcionando
- [ ] Componentes migrados
- [ ] Banco de dados migrado

### Testes
- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Validação manual completa
- [ ] Performance verificada

### Deploy
- [ ] Build de produção funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] DNS e subdomínios configurados
- [ ] Monitoramento ativo

Este guia fornece um roadmap completo para a implementação do sistema multi-tenant, garantindo que todos os aspectos sejam cobertos de forma organizada e eficiente.