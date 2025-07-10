import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import { Tenant } from '@/shared/types/tenant';

interface RestaurantAdminAppProps {
  tenant: Tenant;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

export const RestaurantAdminApp: React.FC<RestaurantAdminAppProps> = ({ tenant }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/*" element={<DashboardPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/configuracoes/*" element={<SettingsPage />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
};

export default RestaurantAdminApp;