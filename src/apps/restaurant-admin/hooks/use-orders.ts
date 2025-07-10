import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenant } from '@/shared/contexts/tenant-context';
import { Order, OrderStatus, OrderCreateInput } from '@/shared/types/order';
import { 
  getOrders, 
  updateOrderStatus as updateOrderStatusService,
  createOrder as createOrderService,
  getOrderStats
} from '@/services/data/order-service';

export const useOrders = () => {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  // Buscar pedidos
  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', tenant?.slug],
    queryFn: async () => {
      if (!tenant?.slug) {
        return [];
      }
      // Para desenvolvimento, usar 'quentinhas-express' como tenant padrão
      const tenantSlug = tenant.slug || 'quentinhas-express';
      return await getOrders(tenantSlug);
    },
    enabled: !!tenant?.slug,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    refetchOnWindowFocus: true
  });

  // Mutation para atualizar status do pedido
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      if (!tenant?.slug) throw new Error('Tenant não encontrado');
      const tenantSlug = tenant.slug || 'quentinhas-express';
      return await updateOrderStatusService(orderId, status, tenantSlug);
    },
    onSuccess: () => {
      // Invalidar cache para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['orders', tenant?.slug] });
    }
  });

  // Mutation para criar pedido
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderCreateInput) => {
      return await createOrderService(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', tenant?.slug] });
    }
  });

  const refreshOrders = () => {
    refetch();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return updateOrderStatusMutation.mutateAsync({ orderId, status });
  };

  const createOrder = async (orderData: OrderCreateInput) => {
    return createOrderMutation.mutateAsync(orderData);
  };

  return {
    orders,
    isLoading,
    error,
    refreshOrders,
    updateOrderStatus,
    createOrder,
    isUpdating: updateOrderStatusMutation.isPending,
    isCreating: createOrderMutation.isPending
  };
};

// Hook para estatísticas de pedidos
export const useOrderStats = () => {
  const { tenant } = useTenant();
  
  const {
    data: stats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['order-stats', tenant?.slug],
    queryFn: async () => {
      if (!tenant?.slug) {
        return {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          activeOrders: 0,
          avgTicket: 0
        };
      }
      // Para desenvolvimento, usar 'quentinhas-express' como tenant padrão
      const tenantSlug = tenant.slug || 'quentinhas-express';
      return await getOrderStats(tenantSlug);
    },
    enabled: !!tenant?.slug,
    refetchInterval: 60000 // Atualizar a cada minuto
  });

  return {
    stats: stats || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      activeOrders: 0,
      avgTicket: 0
    },
    isLoading,
    error
  };
};