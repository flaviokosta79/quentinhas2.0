import { createClient } from '@supabase/supabase-js';
import type { Tenant, TenantSettings } from '../../shared/types';
import { APP_CONFIG, ERROR_MESSAGES } from '../../shared/constants';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

// Cache for tenant data
const tenantCache = new Map<string, { tenant: Tenant; timestamp: number }>();

/**
 * Extract subdomain from hostname
 */
export function extractSubdomain(hostname: string): string | null {
  console.log('🔍 Extracting subdomain from hostname:', hostname);
  console.log('🔍 BASE_DOMAIN:', APP_CONFIG.BASE_DOMAIN);
  
  // Remove www. if present
  const cleanHostname = hostname.replace(/^www\./, '');
  console.log('🔍 Clean hostname:', cleanHostname);
  
  // Check if it's the main domain
  if (cleanHostname === APP_CONFIG.BASE_DOMAIN || cleanHostname === `www.${APP_CONFIG.BASE_DOMAIN}`) {
    console.log('🔍 Is main domain, returning null');
    return null;
  }
  
  // Extract subdomain
  const parts = cleanHostname.split('.');
  console.log('🔍 Hostname parts:', parts);
  
  // For development with localhost, check if hostname has subdomain pattern
  if (import.meta.env.DEV && APP_CONFIG.BASE_DOMAIN === 'localhost') {
    // Pattern: subdomain.localhost or subdomain.localhost:port
    if (parts.length >= 2 && parts[1] === 'localhost') {
      console.log('🔍 Found subdomain (dev mode):', parts[0]);
      return parts[0];
    }
  } else {
    // Production pattern: subdomain.domain.com
    if (parts.length >= 3 && cleanHostname.endsWith(`.${APP_CONFIG.BASE_DOMAIN}`)) {
      console.log('🔍 Found subdomain (prod mode):', parts[0]);
      return parts[0];
    }
  }
  
  console.log('🔍 No subdomain found, returning null');
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
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
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
      status: data.status,
      plan: data.plan || 'starter',
      settings: data.settings ? {
        restaurantName: data.settings.restaurant_name || data.name,
        deliveryTime: data.settings.delivery_time || '30-45 min',
        location: data.settings.location || data.address || '',
        isOpen: data.settings.is_open ?? true,
        deliveryFee: data.settings.delivery_fee || 5.00,
        minimumOrder: data.settings.min_order_value || 15.00,
        paymentMethods: data.settings.payment_methods || ['pix', 'cartao'],
        workingHours: data.settings.business_hours || {
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
      theme: data.theme || {
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
      .select('*')
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
      status: data.status,
      plan: data.plan || 'starter',
      settings: data.settings ? {
        restaurantName: data.settings.restaurant_name || data.name,
        deliveryTime: data.settings.delivery_time || '30-45 min',
        location: data.settings.location || data.address || '',
        isOpen: data.settings.is_open ?? true,
        deliveryFee: data.settings.delivery_fee || 5.00,
        minimumOrder: data.settings.min_order_value || 15.00,
        paymentMethods: data.settings.payment_methods || ['pix', 'cartao'],
        workingHours: data.settings.business_hours || {
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
      theme: data.theme || {
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
      .from('tenants')
      .update({
        settings: settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', tenantId)
      .select('settings')
      .single();

    if (error || !data) {
      throw error;
    }

    // Clear cache for this tenant
    const tenant = await getTenantById(tenantId);
    if (tenant) {
      tenantCache.delete(tenant.slug);
    }

    return data.settings;
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