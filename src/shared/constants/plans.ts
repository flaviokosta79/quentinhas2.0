export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    orders: number; // -1 para ilimitado
    products: number;
    categories: number;
    customTheme: boolean;
    analytics: boolean;
    support: 'email' | 'priority' | 'dedicated';
  };
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 99,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Até 100 pedidos/mês',
      'Cardápio básico',
      'Suporte por email',
      'Tema padrão',
      'Dashboard básico'
    ],
    limits: {
      orders: 100,
      products: 50,
      categories: 10,
      customTheme: false,
      analytics: false,
      support: 'email'
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 199,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Até 500 pedidos/mês',
      'Customização de tema',
      'Suporte prioritário',
      'Analytics avançados',
      'Integração WhatsApp',
      'Relatórios detalhados'
    ],
    limits: {
      orders: 500,
      products: 200,
      categories: 25,
      customTheme: true,
      analytics: true,
      support: 'priority'
    },
    popular: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 399,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Pedidos ilimitados',
      'Customização completa',
      'Suporte dedicado',
      'API personalizada',
      'White label',
      'Múltiplos usuários',
      'Backup automático'
    ],
    limits: {
      orders: -1, // Ilimitado
      products: -1,
      categories: -1,
      customTheme: true,
      analytics: true,
      support: 'dedicated'
    }
  }
};

export const getPlanById = (planId: string): Plan | null => {
  return PLANS[planId] || null;
};

export const formatPrice = (price: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const getPlanFeatures = (planId: string): string[] => {
  const plan = getPlanById(planId);
  return plan?.features || [];
};

export const canUsePlanFeature = (
  planId: string, 
  feature: keyof Plan['limits']
): boolean => {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  return plan.limits[feature] === true || plan.limits[feature] === -1;
};

export const getPlanLimit = (
  planId: string,
  limit: keyof Plan['limits']
): number | boolean | string => {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  
  return plan.limits[limit];
};