import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Phone, 
  MapPin, 
  Printer,
  ChevronRight,
  User,
  Package,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/shared/types/order';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPrint: (order: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onPrint
}) => {
  if (!order) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
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
      confirmed: 'Confirmar Pedido',
      preparing: 'Iniciar Preparo',
      ready: 'Marcar como Pronto',
      delivered: 'Marcar como Entregue'
    };
    return nextStatus ? labels[nextStatus] : null;
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusLabel = getNextStatusLabel(nextStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Pedido #{order.id.slice(-6)}</span>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(order.status)}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPrint(order)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{order.customerInfo.name}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {order.customerInfo.phone}
                </div>
                {order.customerInfo.email && (
                  <div className="text-sm text-muted-foreground mt-1">
                    📧 {order.customerInfo.email}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <div className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereço de Entrega
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>{order.customerInfo.address.street}</div>
                  <div>{order.customerInfo.address.city}, {order.customerInfo.address.state}</div>
                  <div>CEP: {order.customerInfo.address.zipCode}</div>
                  {order.customerInfo.address.complement && (
                    <div>Complemento: {order.customerInfo.address.complement}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Criado em:</div>
                  <div className="text-muted-foreground">{formatDateTime(order.createdAt)}</div>
                </div>
                <div>
                  <div className="font-medium">Atualizado em:</div>
                  <div className="text-muted-foreground">{formatDateTime(order.updatedAt)}</div>
                </div>
              </div>
              
              {order.estimatedDelivery && (
                <div>
                  <div className="font-medium">Previsão de Entrega:</div>
                  <div className="text-muted-foreground">{formatDateTime(order.estimatedDelivery)}</div>
                </div>
              )}
              
              {order.deliveredAt && (
                <div>
                  <div className="font-medium">Entregue em:</div>
                  <div className="text-muted-foreground">{formatDateTime(order.deliveredAt)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-lg">
                          {item.quantity}x {item.productName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tamanho: {item.customizations.size.name} - {formatCurrency(item.customizations.size.price)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} cada
                        </div>
                      </div>
                    </div>
                    
                    {item.customizations.selectedItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Personalizações:</div>
                        {item.customizations.selectedItems.map((category, catIndex) => (
                          <div key={catIndex} className="bg-gray-50 p-3 rounded">
                            <div className="text-sm font-medium mb-1">{category.categoryName}:</div>
                            <div className="text-sm text-muted-foreground">
                              {category.items.map(selectedItem => selectedItem.productName).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pagamento e Total */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status do pagamento:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                    {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
                {order.paymentMethod && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Método: {order.paymentMethod}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  {order.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações */}
        {nextStatus && nextStatusLabel && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => {
                onStatusChange(order.id, nextStatus);
                onClose();
              }}
              className="flex items-center"
            >
              {nextStatusLabel}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};