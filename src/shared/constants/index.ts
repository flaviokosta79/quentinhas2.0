// Plans
export type { Plan } from './plans';
export {
  PLANS,
  getPlanById,
  formatPrice,
  getPlanFeatures,
  canUsePlanFeature,
  getPlanLimit
} from './plans';

// Themes
export {
  DEFAULT_THEME,
  THEME_PRESETS,
  AVAILABLE_FONTS,
  getThemePreset,
  validateTheme,
  mergeWithDefaultTheme
} from './themes';

// Routes
export {
  ROUTES,
  API_ROUTES,
  EXTERNAL_ROUTES,
  PROTECTED_ROUTES,
  ADMIN_ONLY_ROUTES,
  TENANT_ADMIN_ROUTES,
  buildRoute,
  buildApiRoute,
  isProtectedRoute,
  isAdminRoute,
  isTenantAdminRoute
} from './routes';

// Application constants
export const APP_CONFIG = {
  NAME: 'Quentinhas Platform',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plataforma SaaS para delivery de quentinhas',
  SUPPORT_EMAIL: 'suporte@quentinhas.com',
  COMPANY_NAME: 'Quentinhas Ltda',
  BASE_DOMAIN: import.meta.env.DEV ? 'localhost' : 'quentinhas.com',
  
  // Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_PRODUCTS_PER_CATEGORY: 50,
  MAX_CATEGORIES_PER_TENANT: 25,
  
  // Cache
  TENANT_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  THEME_CACHE_TTL: 10 * 60 * 1000, // 10 minutes
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Order settings
  DEFAULT_DELIVERY_FEE: 5.00,
  MIN_ORDER_VALUE: 15.00,
  MAX_ORDER_ITEMS: 10,
  
  // Business hours
  DEFAULT_WORKING_HOURS: {
    monday: { open: '08:00', close: '22:00', isOpen: true },
    tuesday: { open: '08:00', close: '22:00', isOpen: true },
    wednesday: { open: '08:00', close: '22:00', isOpen: true },
    thursday: { open: '08:00', close: '22:00', isOpen: true },
    friday: { open: '08:00', close: '22:00', isOpen: true },
    saturday: { open: '08:00', close: '22:00', isOpen: true },
    sunday: { open: '08:00', close: '22:00', isOpen: false }
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  TENANT_NOT_FOUND: 'Restaurante não encontrado',
  UNAUTHORIZED: 'Acesso não autorizado',
  FORBIDDEN: 'Acesso negado',
  VALIDATION_ERROR: 'Dados inválidos',
  SERVER_ERROR: 'Erro interno do servidor',
  NETWORK_ERROR: 'Erro de conexão',
  PLAN_LIMIT_EXCEEDED: 'Limite do plano excedido',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado',
  SLUG_ALREADY_EXISTS: 'Nome já está em uso',
  PAYMENT_FAILED: 'Falha no pagamento',
  ORDER_NOT_FOUND: 'Pedido não encontrado'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TENANT_CREATED: 'Restaurante criado com sucesso',
  TENANT_UPDATED: 'Restaurante atualizado com sucesso',
  USER_CREATED: 'Usuário criado com sucesso',
  USER_UPDATED: 'Usuário atualizado com sucesso',
  ORDER_CREATED: 'Pedido criado com sucesso',
  ORDER_UPDATED: 'Pedido atualizado com sucesso',
  THEME_UPDATED: 'Tema atualizado com sucesso',
  SETTINGS_SAVED: 'Configurações salvas com sucesso',
  EMAIL_VERIFIED: 'Email verificado com sucesso',
  PASSWORD_RESET: 'Senha redefinida com sucesso'
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]{10,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  URL: /^https?:\/\/.+/
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'quentinhas_auth_token',
  REFRESH_TOKEN: 'quentinhas_refresh_token',
  USER_PREFERENCES: 'quentinhas_user_preferences',
  CART_ITEMS: 'quentinhas_cart_items',
  THEME_CACHE: 'quentinhas_theme_cache',
  TENANT_CACHE: 'quentinhas_tenant_cache'
} as const;