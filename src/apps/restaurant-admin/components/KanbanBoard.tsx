import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  ChefHat,
  XCircle,
  Eye,
  Printer
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/shared/types/order';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  ordersByStatus: Record<OrderStatus, Order[]>;
  onOrderClick: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPrintOrder: (order: Order) => void;
}

const statusConfig = {
  pending: {
    title: 'Novos Pedidos',
    icon: AlertCircle,
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
    nextStatus: 'confirmed' as OrderStatus
  },
  confirmed: {
    title: 'Confirmados',
    icon: CheckCircle,
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
    nextStatus: 'preparing' as OrderStatus
  },
  preparing: {
    title: 'Em Preparo',
    icon: ChefHat,
    color: 'bg-yellow-50 border-yellow-200',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    nextStatus: 'ready' as OrderStatus
  },
  ready: {
    title: 'Prontos',
    icon: Clock,
    color: 'bg-orange-50 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-800',
    nextStatus: 'delivered' as OrderStatus
  },
  delivered: {
    title: 'Entregues',
    icon: Truck,
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
    nextStatus: null
  },
  cancelled: {
    title: 'Cancelados',
    icon: XCircle,
    color: 'bg-gray-50 border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-800',
    nextStatus: null
  }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  ordersByStatus,
  onOrderClick,
  onStatusChange,
  onPrintOrder
}) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(statusConfig).map(([status, config]) => {
        const orders = ordersByStatus[status as OrderStatus] || [];
        const Icon = config.icon;
        
        return (
          <Card key={status} className={cn("h-fit", config.color)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{config.title}</span>
                </div>
                <Badge variant="secondary" className={config.badgeColor}>
                  {orders.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="kanban-cards-container">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum pedido</p>
                </div>
              ) : (
                orders.map((order) => (
                  <Card
                    key={order.id}
                    className="kanban-card-uniform cursor-pointer bg-white"
                    onClick={() => onOrderClick(order)}
                  >
                    <div className="card-content">
                      <div className="card-body">
                        <div className="space-y-2">
                          {/* Header do pedido */}
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm">
                              #{order.id.slice(-6)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getTimeAgo(order.createdAt)}
                            </div>
                          </div>

                          {/* Cliente */}
                          <div className="text-sm">
                            <div className="font-medium">{order.customerInfo.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.customerInfo.phone}
                            </div>
                          </div>

                          {/* Itens */}
                          <div className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </div>

                          {/* Total */}
                          <div className="font-semibold text-sm">
                            {formatCurrency(order.total)}
                          </div>

                          {/* Status do pagamento */}
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                            </Badge>
                            {order.paymentMethod && (
                              <span className="text-xs text-muted-foreground">
                                {order.paymentMethod}
                              </span>
                            )}
                          </div>

                          {/* Observações */}
                          {order.notes && (
                            <div className="kanban-notes text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                              📝 {order.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <div className="card-actions">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOrderClick(order);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPrintOrder(order);
                              }}
                            >
                              <Printer className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {config.nextStatus && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(order.id, config.nextStatus!);
                              }}
                              className="text-xs"
                            >
                              {config.nextStatus === 'confirmed' && 'Confirmar'}
                              {config.nextStatus === 'preparing' && 'Preparar'}
                              {config.nextStatus === 'ready' && 'Pronto'}
                              {config.nextStatus === 'delivered' && 'Entregar'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};