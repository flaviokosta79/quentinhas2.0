import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  DollarSign, 
  Package, 
  Users, 
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  ChefHat,
  Phone,
  MapPin,
  Eye,
  Printer
} from 'lucide-react';
import { useTenant } from '@/shared/contexts/tenant-context';
import { useOrders } from '../hooks/use-orders';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/shared/types/order';
import { KanbanBoard } from '../components/KanbanBoard';
import { AdminNavigation } from '../components/AdminNavigation';

const DashboardPage = () => {
  const { tenant } = useTenant();
  const { orders, isLoading, updateOrderStatus, refreshOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Agrupar pedidos por status para o Kanban
  const ordersByStatus = React.useMemo(() => {
    const grouped: Record<OrderStatus, Order[]> = {
      pending: [],
      confirmed: [],
      preparing: [],
      ready: [],
      delivered: [],
      cancelled: []
    };

    orders.forEach(order => {
      grouped[order.status].push(order);
    });

    return grouped;
  }, [orders]);

  // Estatísticas do dashboard
  const stats = React.useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );

    return {
      totalOrders: todayOrders.length,
      totalRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: ordersByStatus.pending.length,
      activeOrders: ordersByStatus.confirmed.length + ordersByStatus.preparing.length + ordersByStatus.ready.length
    };
  }, [orders, ordersByStatus]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    // Aqui poderia abrir um modal de detalhes
    console.log('Pedido selecionado:', order);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Tocar som de notificação se disponível
      if ('Audio' in window) {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {}); // Ignorar erro se não conseguir tocar
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const handlePrintOrder = (order: Order) => {
    // Implementar impressão do pedido
    console.log('Imprimir pedido:', order);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AdminNavigation currentView="dashboard" />

      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard de Pedidos</h1>
              <p className="text-muted-foreground">Gerencie seus pedidos e acompanhe as vendas em tempo real</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => refreshOrders()}>
                <Clock className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              {stats.pendingOrders > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {stats.pendingOrders} novos pedidos
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos Hoje
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total de pedidos do dia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento Hoje
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Receita total do dia</p>
            </CardContent>
          </Card>

          <Card className={stats.pendingOrders > 0 ? 'ring-2 ring-red-200 animate-pulse' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos Pendentes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
              {stats.pendingOrders > 0 && (
                <div className="flex items-center mt-2 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Requer atenção
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos Ativos
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">Em preparo ou prontos</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="kanban" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kanban">Painel Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista de Pedidos</TabsTrigger>
          </TabsList>

          {/* Painel Kanban */}
          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard
              ordersByStatus={ordersByStatus}
              onOrderClick={handleOrderClick}
              onStatusChange={handleStatusChange}
              onPrintOrder={handlePrintOrder}
            />
          </TabsContent>

          {/* Lista de Pedidos */}
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-muted-foreground">
                        Os pedidos aparecerão aqui quando os clientes fizerem pedidos.
                      </p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOrderClick(order)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">Pedido #{order.id.slice(-6)}</h3>
                                <Badge className={
                                  order.status === 'pending' ? 'bg-red-100 text-red-800' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'ready' ? 'bg-orange-100 text-orange-800' :
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {ORDER_STATUS_LABELS[order.status]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                              <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(order.total)}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;