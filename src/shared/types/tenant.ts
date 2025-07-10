export interface Tenant {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  settings: TenantSettings;
  theme: TenantTheme;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  restaurantName: string;
  deliveryTime: string;
  location: string;
  isOpen: boolean;
  deliveryFee: number;
  minimumOrder: number;
  paymentMethods: string[];
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
}

export interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground?: string;
    muted?: string;
  };
  logo: string;
  favicon?: string;
  fonts: {
    primary: string;
    secondary: string;
  };
  customCSS?: string;
  layout?: {
    headerStyle: 'default' | 'minimal' | 'centered';
    footerStyle: 'default' | 'minimal' | 'hidden';
  };
}

export interface TenantCreateInput {
  slug: string;
  name: string;
  email: string;
  phone?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  settings?: Partial<TenantSettings>;
  theme?: Partial<TenantTheme>;
}

export type TenantType = 'restaurant' | 'admin' | 'onboarding' | 'landing';