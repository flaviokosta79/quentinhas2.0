import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Store,
  Settings,
  Menu,
  Bell,
  LogOut
} from 'lucide-react';
import { useTenant } from '@/shared/contexts/tenant-context';
import { useOrders } from '../hooks/use-orders';

interface AdminNavigationProps {
  currentView?: 'dashboard' | 'settings';
  onViewChange?: (view: 'dashboard' | 'settings') => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentView = 'dashboard',
  onViewChange
}) => {
  const { tenant } = useTenant();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  // Contar pedidos pendentes
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  // Determinar a view atual baseada na URL
  const getCurrentView = () => {
    if (location.pathname.includes('/settings') || location.pathname.includes('/configuracoes')) {
      return 'settings';
    }
    return 'dashboard';
  };

  const handleViewChange = (view: 'dashboard' | 'settings') => {
    if (view === 'dashboard') {
      navigate('/admin');
    } else if (view === 'settings') {
      navigate('/admin/settings');
    }
    onViewChange?.(view);
  };

  const goToStorefront = () => {
    // Navegar para o storefront do restaurante (sem /admin ou /dashboard)
    const currentUrl = window.location;
    const storefrontUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    window.open(storefrontUrl, '_blank');
  };

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome do Restaurante */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={tenant?.theme.logo || '/assets/logo-quentinhas.jpg'} 
                alt="Logo" 
                className="h-8 w-8 rounded"
              />
              <div>
                <h1 className="font-semibold text-lg">{tenant?.settings.restaurantName}</h1>
                <p className="text-xs text-muted-foreground">Painel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navegação Central */}
          <div className="flex items-center space-x-2">
            <Button
              variant={getCurrentView() === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange('dashboard')}
              className="flex items-center space-x-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
              {pendingOrders > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {pendingOrders}
                </Badge>
              )}
            </Button>

            <Button
              variant={getCurrentView() === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange('settings')}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </Button>
          </div>

          {/* Ações */}
          <div className="flex items-center space-x-2">
            {/* Notificações */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {pendingOrders > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs animate-pulse"
                >
                  {pendingOrders}
                </Badge>
              )}
            </Button>

            {/* Ver Storefront */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToStorefront}
              className="flex items-center space-x-2"
            >
              <Store className="h-4 w-4" />
              <span>Ver Loja</span>
            </Button>

            {/* Menu */}
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};