export const ROUTES = {
  // Landing Page Routes
  LANDING: {
    HOME: '/',
    PRICING: '/pricing',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register'
  },

  // Restaurant Storefront Routes
  RESTAURANT: {
    HOME: '/',
    MENU: '/menu',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_CONFIRMATION: '/order/:orderId',
    TRACK_ORDER: '/track/:orderId'
  },

  // Restaurant Admin Routes
  RESTAURANT_ADMIN: {
    DASHBOARD: '/admin',
    MENU_MANAGEMENT: '/admin/menu',
    ORDERS: '/admin/orders',
    ORDER_DETAIL: '/admin/orders/:orderId',
    CUSTOMERS: '/admin/customers',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    THEME: '/admin/theme',
    PROFILE: '/admin/profile'
  },

  // Super Admin Routes
  SUPER_ADMIN: {
    DASHBOARD: '/admin',
    TENANTS: '/admin/tenants',
    TENANT_DETAIL: '/admin/tenants/:tenantId',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    BILLING: '/admin/billing',
    SETTINGS: '/admin/settings',
    SUPPORT: '/admin/support'
  },

  // Onboarding Routes
  ONBOARDING: {
    WELCOME: '/',
    REGISTER: '/register',
    SETUP: '/setup',
    THEME: '/theme',
    MENU: '/menu',
    COMPLETE: '/complete',
    LOGIN: '/login'
  }
} as const;

export const API_ROUTES = {
  // Tenant Management
  TENANTS: '/api/tenants',
  TENANT_BY_SLUG: '/api/tenants/slug/:slug',
  TENANT_BY_ID: '/api/tenants/:id',

  // User Management
  USERS: '/api/users',
  USER_BY_ID: '/api/users/:id',
  USER_PROFILE: '/api/users/profile',

  // Restaurant Data
  CATEGORIES: '/api/categories',
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: '/api/products/:id',

  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: '/api/orders/:id',
  ORDER_STATUS: '/api/orders/:id/status',

  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESET_PASSWORD: '/api/auth/reset-password'
  },

  // Theme Management
  THEME: '/api/theme',
  THEME_PRESETS: '/api/theme/presets',

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    ORDERS: '/api/analytics/orders',
    REVENUE: '/api/analytics/revenue',
    PRODUCTS: '/api/analytics/products'
  }
} as const;

export const EXTERNAL_ROUTES = {
  STRIPE_CHECKOUT: 'https://checkout.stripe.com',
  WHATSAPP_API: 'https://api.whatsapp.com',
  GOOGLE_MAPS: 'https://maps.googleapis.com'
} as const;

// Helper functions for route building
export const buildRoute = (route: string, params: Record<string, string>): string => {
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, value);
  });
  return builtRoute;
};

export const buildApiRoute = (route: string, params: Record<string, string> = {}): string => {
  return buildRoute(route, params);
};

// Route guards and permissions
export const PROTECTED_ROUTES = [
  ...Object.values(ROUTES.RESTAURANT_ADMIN),
  ...Object.values(ROUTES.SUPER_ADMIN),
  ROUTES.ONBOARDING.SETUP,
  ROUTES.ONBOARDING.THEME,
  ROUTES.ONBOARDING.MENU
];

export const ADMIN_ONLY_ROUTES = [
  ...Object.values(ROUTES.SUPER_ADMIN)
];

export const TENANT_ADMIN_ROUTES = [
  ...Object.values(ROUTES.RESTAURANT_ADMIN)
];

export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isAdminRoute = (path: string): boolean => {
  return ADMIN_ONLY_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isTenantAdminRoute = (path: string): boolean => {
  return TENANT_ADMIN_ROUTES.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};