import { Order, OrderStatus, OrderCreateInput } from '@/shared/types/order';

// Mock data para desenvolvimento - dados reais do banco inseridos anteriormente
const mockOrders: Order[] = [
  {
    id: '5ebe9420-20cb-4c4a-a5d9-abf4d7981b3f',
    tenantId: 'quentinhas-express',
    customerInfo: {
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        complement: 'Apto 45'
      }
    },
    items: [
      {
        productId: '1',
        productName: 'Quentinha Média',
        quantity: 1,
        price: 18.00,
        customizations: {
          size: {
            id: '2',
            name: 'Média',
            price: 18.00,
            description: 'Quentinha Média'
          },
          selectedItems: [
            {
              categoryId: '1',
              categoryName: 'Base',
              items: [
                { productId: '1', productName: 'Arroz Branco' }
              ]
            },
            {
              categoryId: '2',
              categoryName: 'Proteína',
              items: [
                { productId: '5', productName: 'Frango Grelhado' }
              ]
            }
          ]
        }
      }
    ],
    subtotal: 18.00,
    deliveryFee: 5.00,
    total: 23.00,
    status: 'pending',
    paymentStatus: 'pending',
    notes: 'Sem cebola, por favor',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: '2727c70a-aedf-4031-ad32-878d885e707b',
    tenantId: 'quentinhas-express',
    customerInfo: {
      name: 'Maria Santos',
      phone: '(11) 88888-8888',
      address: {
        street: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      }
    },
    items: [
      {
        productId: '1',
        productName: 'Quentinha Grande',
        quantity: 2,
        price: 20.00,
        customizations: {
          size: {
            id: '3',
            name: 'Grande',
            price: 20.00,
            description: 'Quentinha Grande'
          },
          selectedItems: [
            {
              categoryId: '1',
              categoryName: 'Base',
              items: [
                { productId: '1', productName: 'Arroz Branco' },
                { productId: '2', productName: 'Feijão Carioca' }
              ]
            }
          ]
        }
      }
    ],
    subtotal: 40.00,
    deliveryFee: 5.00,
    total: 45.00,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'PIX',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: '6424a909-0307-4467-94ff-67c19aa0662e',
    tenantId: 'quentinhas-express',
    customerInfo: {
      name: 'Pedro Costa',
      phone: '(11) 77777-7777',
      address: {
        street: 'Rua Augusta, 500',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000'
      }
    },
    items: [
      {
        productId: '1',
        productName: 'Quentinha Pequena',
        quantity: 1,
        price: 15.00,
        customizations: {
          size: {
            id: '1',
            name: 'Pequena',
            price: 15.00,
            description: 'Quentinha Pequena'
          },
          selectedItems: [
            {
              categoryId: '1',
              categoryName: 'Base',
              items: [
                { productId: '1', productName: 'Arroz Branco' }
              ]
            }
          ]
        }
      }
    ],
    subtotal: 15.00,
    deliveryFee: 5.00,
    total: 20.00,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'Cartão',
    estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '0d7702b9-5a8f-460b-8a49-0e2a50f94823',
    tenantId: 'quentinhas-express',
    customerInfo: {
      name: 'Ana Oliveira',
      phone: '(11) 66666-6666',
      address: {
        street: 'Rua da Consolação, 200',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01302-000'
      }
    },
    items: [
      {
        productId: '1',
        productName: 'Quentinha Média',
        quantity: 1,
        price: 18.00,
        customizations: {
          size: {
            id: '2',
            name: 'Média',
            price: 18.00,
            description: 'Quentinha Média'
          },
          selectedItems: [
            {
              categoryId: '1',
              categoryName: 'Base',
              items: [
                { productId: '1', productName: 'Arroz Branco' }
              ]
            }
          ]
        }
      }
    ],
    subtotal: 18.00,
    deliveryFee: 5.00,
    total: 23.00,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'PIX',
    estimatedDelivery: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrders = async (tenantId: string): Promise<Order[]> => {
  await delay(500);
  console.log('Buscando pedidos para tenant:', tenantId);
  const orders = mockOrders.filter(order => order.tenantId === tenantId);
  console.log('Pedidos encontrados:', orders.length);
  return orders;
};

export const getOrderById = async (orderId: string, tenantId: string): Promise<Order | null> => {
  await delay(300);
  const order = mockOrders.find(order => order.id === orderId && order.tenantId === tenantId);
  return order || null;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, tenantId: string): Promise<Order> => {
  await delay(300);
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId && order.tenantId === tenantId);
  if (orderIndex === -1) {
    throw new Error('Pedido não encontrado');
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };

  return mockOrders[orderIndex];
};

export const createOrder = async (orderData: OrderCreateInput): Promise<Order> => {
  await delay(500);
  
  const newOrder: Order = {
    id: Math.random().toString(36).substr(2, 9),
    tenantId: orderData.tenantId,
    customerId: orderData.customerId,
    customerInfo: orderData.customerInfo,
    items: orderData.items.map(item => ({
      ...item,
      productName: `Produto ${item.productId}`
    })),
    subtotal: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    deliveryFee: 5.00,
    total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.00,
    status: 'pending',
    paymentStatus: 'pending',
    notes: orderData.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockOrders.unshift(newOrder);
  return newOrder;
};

export const getOrderStats = async (tenantId: string) => {
  await delay(200);
  
  const orders = mockOrders.filter(order => order.tenantId === tenantId);
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayOrders = orders.filter(order => new Date(order.createdAt) >= startOfDay);
  
  return {
    totalOrders: todayOrders.length,
    totalRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    activeOrders: orders.filter(order => 
      ['confirmed', 'preparing', 'ready'].includes(order.status)
    ).length,
    avgTicket: todayOrders.length > 0 
      ? todayOrders.reduce((sum, order) => sum + order.total, 0) / todayOrders.length 
      : 0
  };
};