import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Phone, 
  MapPin, 
  Eye, 
  Printer,
  ChevronRight
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/shared/types/order';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPrint: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onClick,
  onStatusChange,
  onPrint
}) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: null,
      cancelled: null
    };
    return statusFlow[currentStatus] as OrderStatus | null;
  };

  const getNextStatusLabel = (nextStatus: OrderStatus | null) => {
    const labels = {
      confirmed: 'Confirmar',
      preparing: 'Preparar',
      ready: 'Marcar Pronto',
      delivered: 'Entregar'
    };
    return nextStatus ? labels[nextStatus] : null;
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(nextStatus);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Informações principais */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg">
                  Pedido #{order.id.slice(-6)}
                </h3>
                <Badge className={getStatusColor(order.status)}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getTimeAgo(order.createdAt)}
              </div>
            </div>

            {/* Cliente */}
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="font-medium">{order.customerInfo.name}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  {order.customerInfo.phone}
                </div>
                <div className="text-sm text-muted-foreground flex items-start mt-1">
                  <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    {order.customerInfo.address.street}, {order.customerInfo.address.city}
                    {order.customerInfo.address.complement && 
                      ` - ${order.customerInfo.address.complement}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Itens */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Itens do pedido:</div>
              {order.items.map((item, index) => (
                <div key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-gray-100">
                  <div className="flex justify-between">
                    <span>
                      {item.quantity}x {item.productName} ({item.customizations.size.name})
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  {item.customizations.selectedItems.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.customizations.selectedItems.map(category => 
                        category.items.map(selectedItem => selectedItem.productName).join(', ')
                      ).join(' | ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Observações */}
            {order.notes && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-1">Observações:</div>
                <div className="text-sm text-muted-foreground">{order.notes}</div>
              </div>
            )}

            {/* Total e Pagamento */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Subtotal: {formatCurrency(order.subtotal)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Entrega: {formatCurrency(order.deliveryFee)}
                </div>
                <div className="font-semibold text-lg">
                  Total: {formatCurrency(order.total)}
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}
                  className="mb-1"
                >
                  {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                </Badge>
                {order.paymentMethod && (
                  <div className="text-sm text-muted-foreground">
                    via {order.paymentMethod}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col space-y-2 ml-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            {nextStatus && nextStatusLabel && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(order.id, nextStatus);
                }}
              >
                {nextStatusLabel}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};