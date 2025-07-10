import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Package, 
  Clock, 
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    activeOrders: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const avgTicket = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  const statsCards = [
    {
      title: 'Pedidos Hoje',
      value: stats.totalOrders,
      icon: Package,
      description: 'Total de pedidos do dia',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Faturamento Hoje',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      description: 'Receita total do dia',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: AlertCircle,
      description: 'Aguardando confirmação',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      urgent: stats.pendingOrders > 0
    },
    {
      title: 'Pedidos Ativos',
      value: stats.activeOrders,
      icon: Clock,
      description: 'Em preparo ou prontos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(avgTicket),
      icon: TrendingUp,
      description: 'Valor médio por pedido',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card 
            key={index} 
            className={`${stat.urgent ? 'ring-2 ring-red-200 animate-pulse' : ''}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.urgent && (
                <div className="flex items-center mt-2 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Requer atenção
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};