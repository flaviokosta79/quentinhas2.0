import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from './shared/contexts/tenant-context';
import LandingApp from './apps/landing/LandingApp';
import RestaurantPage from './pages/RestaurantPage';
import { RestaurantAdminApp } from './apps/restaurant-admin/RestaurantAdminApp';

// Componente para mostrar loading
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

// Componente para mostrar erro de tenant não encontrado
function TenantNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurante não encontrado</h1>
          <p className="text-gray-600 mb-6">
            O restaurante que você está procurando não existe ou não está mais ativo.
          </p>
          <button
            onClick={() => window.location.href = window.location.protocol + '//' + (import.meta.env.DEV ? 'localhost:8080' : 'quentinhas.com')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}

// Roteador condicional baseado no contexto do tenant
function ConditionalRouter() {
  const { tenant, isLoading, error, isTenantDomain } = useTenant();

  // Mostrar loading enquanto resolve o tenant
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Se estamos em um subdomínio mas não encontramos o tenant
  if (isTenantDomain && !tenant) {
    return <TenantNotFound />;
  }

  // Se estamos em um subdomínio e encontramos o tenant - mostrar loja
  if (isTenantDomain && tenant) {
    return (
      <Routes>
        <Route path="/" element={<RestaurantPage />} />
        <Route path="/cardapio" element={<RestaurantPage />} />
        <Route path="/pedido" element={<RestaurantPage />} />
        <Route path="/contato" element={<RestaurantPage />} />
        <Route path="/admin/*" element={<RestaurantAdminApp tenant={tenant} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Se estamos no domínio principal - mostrar landing page
  return (
    <Routes>
      <Route path="/*" element={<LandingApp />} />
    </Routes>
  );
}

// App principal com provider de tenant
export function AppWithTenant() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <ConditionalRouter />
      </TenantProvider>
    </BrowserRouter>
  );
}