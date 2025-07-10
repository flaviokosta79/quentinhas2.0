import { Tenant } from './tenant';

export interface User {
  id: string;
  tenantId: string;
  email: string;
  role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer';
  profile: UserProfile;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  phone?: string;
  avatar?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

export interface AuthUser extends User {
  tenant: Tenant;
}

export interface UserCreateInput {
  tenantId: string;
  email: string;
  password: string;
  role?: 'tenant_admin' | 'staff' | 'customer';
  profile: {
    name: string;
    phone?: string;
  };
}

export interface UserUpdateInput {
  profile?: Partial<UserProfile>;
  role?: 'tenant_admin' | 'staff' | 'customer';
}

export type UserRole = User['role'];