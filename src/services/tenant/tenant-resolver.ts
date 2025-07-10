import { createClient } from '@supabase/supabase-js';
import type { Tenant, TenantSettings } from '../../shared/types';
import { APP_CONFIG, ERROR_MESSAGES } from '../../shared/constants';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cache for tenant data
const tenantCache = new Map<string, { tenant: Tenant; timestamp: number }>();

/**
 * Extract subdomain from hostname
 */
export function extractSubdomain(hostname: string): string | null {
  // Remove www. if present
  const cleanHostname = hostname.replace(/^www\./, '');
  
  // Check if it's the main domain
  if (cleanHostname === APP_CONFIG.BASE_DOMAIN || cleanHostname === `www.${APP_CONFIG.BASE_DOMAIN}`) {
    return null;
  }
  
  // Extract subdomain
  const parts = cleanHostname.split('.');
  if (parts.length >= 3 && cleanHostname.endsWith(`.${APP_CONFIG.BASE_DOMAIN}`)) {
    return parts[0];
  }
  
  return null;
}

/**
 * Get current subdomain from window location
 */
export function getCurrentSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  return extractSubdomain(window.location.hostname);
}

/**
 * Check if tenant data is cached and still valid
 */
function getCachedTenant(slug: string): Tenant | null {
  const cached = tenantCache.get(slug);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > APP_CONFIG.TENANT_CACHE_TTL;
  if (isExpired) {
    tenantCache.delete(slug);
    return null;
  }
  
  return cached.tenant;
}

/**
 * Cache tenant data
 */
function cacheTenant(slug: string, tenant: Tenant): void {
  tenantCache.set(slug, {
    tenant,
    timestamp: Date.now()
  });
}

/**
 * Resolve tenant by slug (subdomain)
 */
export async function resolveTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    // Check cache first
    const cachedTenant = getCachedTenant(slug);
    if (cachedTenant) {
      return cachedTenant;
    }

    // Query database
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        tenant_settings (*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    // Transform database result to Tenant type
    const tenant: Tenant = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address ? {
        street: data.address.street || '',
        city: data.address.city || '',
        state: data.address.state || '',
        zipCode: data.address.zipCode || '',
        country: data.address.country || 'Brasil'
      } : undefined,
      domain: data.domain,
      status: data.is_active ? 'active' : 'inactive',
      plan: data.plan_id || 'starter',
      settings: data.tenant_settings ? {
        restaurantName: data.tenant_settings.restaurant_name || data.name,
        deliveryTime: data.tenant_settings.delivery_time || '30-45 min',
        location: data.tenant_settings.location || data.address || '',
        isOpen: data.tenant_settings.is_open ?? true,
        deliveryFee: data.tenant_settings.delivery_fee || 5.00,
        minimumOrder: data.tenant_settings.min_order_value || 15.00,
        paymentMethods: data.tenant_settings.payment_methods || ['pix', 'cartao'],
        workingHours: data.tenant_settings.business_hours || {
          monday: { open: '08:00', close: '22:00', isOpen: true },
          tuesday: { open: '08:00', close: '22:00', isOpen: true },
          wednesday: { open: '08:00', close: '22:00', isOpen: true },
          thursday: { open: '08:00', close: '22:00', isOpen: true },
          friday: { open: '08:00', close: '22:00', isOpen: true },
          saturday: { open: '08:00', close: '22:00', isOpen: true },
          sunday: { open: '08:00', close: '22:00', isOpen: false }
        }
      } : {
        restaurantName: data.name,
        deliveryTime: '30-45 min',
        location: data.address || '',
        isOpen: true,
        deliveryFee: 5.00,
        minimumOrder: 15.00,
        paymentMethods: ['pix', 'cartao'],
        workingHours: {
          monday: { open: '08:00', close: '22:00', isOpen: true },
          tuesday: { open: '08:00', close: '22:00', isOpen: true },
          wednesday: { open: '08:00', close: '22:00', isOpen: true },
          thursday: { open: '08:00', close: '22:00', isOpen: true },
          friday: { open: '08:00', close: '22:00', isOpen: true },
          saturday: { open: '08:00', close: '22:00', isOpen: true },
          sunday: { open: '08:00', close: '22:00', isOpen: false }
        }
      },
      theme: data.tenant_settings?.theme || {
        colors: {
          primary: '#FF6B35',
          secondary: '#F7931E',
          accent: '#FFD23F',
          background: '#FFFFFF'
        },
        logo: data.logo_url || '',
        fonts: {
          primary: 'Inter',
          secondary: 'Inter'
        }
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    // Cache the result
    cacheTenant(slug, tenant);

    return tenant;
  } catch (error) {
    console.error('Error resolving tenant:', error);
    throw new Error(ERROR_MESSAGES.TENANT_NOT_FOUND);
  }
}

/**
 * Resolve current tenant based on subdomain
 */
export async function resolveCurrentTenant(): Promise<Tenant | null> {
  const subdomain = getCurrentSubdomain();
  if (!subdomain) {
    return null;
  }
  
  return resolveTenantBySlug(subdomain);
}

/**
 * Get tenant by ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        tenant_settings (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address ? {
        street: data.address.street || '',
        city: data.address.city || '',
        state: data.address.state || '',
        zipCode: data.address.zipCode || '',
        country: data.address.country || 'Brasil'
      } : undefined,
      domain: data.domain,
      status: data.is_active ? 'active' : 'inactive',
      plan: data.plan_id || 'starter',
      settings: data.tenant_settings ? {
        restaurantName: data.tenant_settings.restaurant_name || data.name,
        deliveryTime: data.tenant_settings.delivery_time || '30-45 min',
        location: data.tenant_settings.location || data.address || '',
        isOpen: data.tenant_settings.is_open ?? true,
        deliveryFee: data.tenant_settings.delivery_fee || 5.00,
        minimumOrder: data.tenant_settings.min_order_value || 15.00,
        paymentMethods: data.tenant_settings.payment_methods || ['pix', 'cartao'],
        workingHours: data.tenant_settings.business_hours || {
          monday: { open: '08:00', close: '22:00', isOpen: true },
          tuesday: { open: '08:00', close: '22:00', isOpen: true },
          wednesday: { open: '08:00', close: '22:00', isOpen: true },
          thursday: { open: '08:00', close: '22:00', isOpen: true },
          friday: { open: '08:00', close: '22:00', isOpen: true },
          saturday: { open: '08:00', close: '22:00', isOpen: true },
          sunday: { open: '08:00', close: '22:00', isOpen: false }
        }
      } : {
        restaurantName: data.name,
        deliveryTime: '30-45 min',
        location: data.address || '',
        isOpen: true,
        deliveryFee: 5.00,
        minimumOrder: 15.00,
        paymentMethods: ['pix', 'cartao'],
        workingHours: {
          monday: { open: '08:00', close: '22:00', isOpen: true },
          tuesday: { open: '08:00', close: '22:00', isOpen: true },
          wednesday: { open: '08:00', close: '22:00', isOpen: true },
          thursday: { open: '08:00', close: '22:00', isOpen: true },
          friday: { open: '08:00', close: '22:00', isOpen: true },
          saturday: { open: '08:00', close: '22:00', isOpen: true },
          sunday: { open: '08:00', close: '22:00', isOpen: false }
        }
      },
      theme: data.tenant_settings?.theme || {
        colors: {
          primary: '#FF6B35',
          secondary: '#F7931E',
          accent: '#FFD23F',
          background: '#FFFFFF'
        },
        logo: data.logo_url || '',
        fonts: {
          primary: 'Inter',
          secondary: 'Inter'
        }
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error getting tenant by ID:', error);
    return null;
  }
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(
  tenantId: string,
  settings: Partial<TenantSettings>
): Promise<TenantSettings | null> {
  try {
    const { data, error } = await supabase
      .from('tenant_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error || !data) {
      throw error;
    }

    // Clear cache for this tenant
    const tenant = await getTenantById(tenantId);
    if (tenant) {
      tenantCache.delete(tenant.slug);
    }

    return data;
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    throw error;
  }
}

/**
 * Check if tenant exists by slug
 */
export async function checkTenantExists(slug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Clear tenant cache
 */
export function clearTenantCache(slug?: string): void {
  if (slug) {
    tenantCache.delete(slug);
  } else {
    tenantCache.clear();
  }
}

/**
 * Get tenant URL
 */
export function getTenantUrl(slug: string, path = ''): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${slug}.${APP_CONFIG.BASE_DOMAIN}${port}${path}`;
}

/**
 * Redirect to tenant subdomain
 */
export function redirectToTenant(slug: string, path = ''): void {
  const url = getTenantUrl(slug, path);
  window.location.href = url;
}

/**
 * Check if current domain is a tenant subdomain
 */
export function isTenantDomain(): boolean {
  return getCurrentSubdomain() !== null;
}

/**
 * Get main domain URL
 */
export function getMainDomainUrl(path = ''): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${APP_CONFIG.BASE_DOMAIN}${port}${path}`;
}