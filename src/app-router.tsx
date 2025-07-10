import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders, useTenant } from './shared/contexts';
import { extractSubdomain, isTenantDomain } from './services/tenant/tenant-resolver';
import { ROUTES } from './shared/constants';

// Import different applications
import Index from './pages/Index';
import RestaurantPage from './pages/RestaurantPage';
// import AdminApp from './apps/admin/AdminApp';
// import OnboardingApp from './apps/onboarding/OnboardingApp';

// Use the original Index page as Landing App
const LandingApp = Index;
// Use the new RestaurantPage for tenant subdomains
const RestaurantApp = RestaurantPage;
const AdminApp = () => <div>Admin App - Coming Soon</div>;
const OnboardingApp = () => <div>Onboarding App - Coming Soon</div>;

// Temporary components (will be moved to shared/components later)
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

/**
 * Main App Router that determines which application to load
 * based on the current subdomain and tenant context
 */
function AppRouter() {
  const [appType, setAppType] = useState<'landing' | 'restaurant' | 'admin' | 'onboarding' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const determineAppType = () => {
      const hostname = window.location.hostname;
      const subdomain = extractSubdomain(hostname);
      const pathname = window.location.pathname;

      // Check if we're on a tenant subdomain
      if (subdomain) {
        // Special subdomains
        if (subdomain === 'admin') {
          setAppType('admin');
        } else if (subdomain === 'onboarding' || subdomain === 'cadastro') {
          setAppType('onboarding');
        } else {
          // Regular tenant subdomain - restaurant app
          setAppType('restaurant');
        }
      } else {
        // Main domain - check path for admin routes
        if (pathname.startsWith('/admin')) {
          setAppType('admin');
        } else if (pathname.startsWith('/onboarding') || pathname.startsWith('/cadastro')) {
          setAppType('onboarding');
        } else {
          // Main landing page
          setAppType('landing');
        }
      }

      setIsLoading(false);
    };

    determineAppType();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders
          tenantFallback={<LoadingSpinner />}
          tenantErrorFallback={<TenantErrorFallback />}
        >
          <AppContent appType={appType} />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

/**
 * App content component that renders the appropriate application
 */
function AppContent({ appType }: { appType: string | null }) {
  const { tenant, isLoading, error } = useTenant();

  // For restaurant app, we need a valid tenant
  if (appType === 'restaurant') {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error || !tenant) {
      return <TenantNotFoundError />;
    }

    if (tenant.status !== 'active') {
      return <TenantInactiveError tenant={tenant} />;
    }
  }

  switch (appType) {
    case 'landing':
      return <LandingApp />;
    
    case 'restaurant':
      return <RestaurantApp />;
    
    case 'admin':
      return <AdminApp />;
    
    case 'onboarding':
      return <OnboardingApp />;
    
    default:
      return <Navigate to="/" replace />;
  }
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

/**
 * Tenant error fallback component
 */
function TenantErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Erro ao carregar restaurante
        </h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro ao tentar carregar as informações do restaurante. 
          Tente novamente em alguns instantes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

/**
 * Tenant not found error component
 */
function TenantNotFoundError() {
  const subdomain = extractSubdomain(window.location.hostname);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-gray-400 text-6xl mb-4">🏪</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Restaurante não encontrado
        </h1>
        <p className="text-gray-600 mb-6">
          O restaurante "{subdomain}" não foi encontrado ou não está mais ativo.
        </p>
        <div className="space-y-3">
          <a
            href={`${window.location.protocol}//${process.env.REACT_APP_BASE_DOMAIN || 'quentinhas.com'}`}
            className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ir para página principal
          </a>
          <a
            href={`${window.location.protocol}//onboarding.${process.env.REACT_APP_BASE_DOMAIN || 'quentinhas.com'}`}
            className="block border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2 rounded-lg transition-colors"
          >
            Cadastrar meu restaurante
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Tenant inactive error component
 */
function TenantInactiveError({ tenant }: { tenant: { name: string; email?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-yellow-500 text-6xl mb-4">⏸️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Restaurante temporariamente indisponível
        </h1>
        <p className="text-gray-600 mb-6">
          O restaurante "{tenant.name}" está temporariamente indisponível. 
          Entre em contato conosco para mais informações.
        </p>
        <div className="space-y-3">
          <a
            href={`${window.location.protocol}//${process.env.REACT_APP_BASE_DOMAIN || 'quentinhas.com'}`}
            className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ir para página principal
          </a>
          {tenant.email && (
            <a
              href={`mailto:${tenant.email}`}
              className="block border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2 rounded-lg transition-colors"
            >
              Entrar em contato
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppRouter;