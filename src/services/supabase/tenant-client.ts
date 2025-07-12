import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getCurrentSubdomain, resolveTenantBySlug } from '../tenant/tenant-resolver';

// Cliente Supabase configurado
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrsjmbzmvngzhdaofhsg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyc2ptYnptdm5nemhkYW9maHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTgzNzYsImV4cCI6MjA2NzY3NDM3Nn0.hzHI72U_2nw9Rs1Moyfmub6-i5A77XCHxjoDfUG7-jw';

// Cliente base
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Cache para tenant_id atual
let currentTenantId: string | null = null;
let tenantIdPromise: Promise<string | null> | null = null;

/**
 * Obtém o tenant_id atual baseado no subdomain
 */
async function getCurrentTenantId(): Promise<string | null> {
  // Se já temos o tenant_id em cache, retorna
  if (currentTenantId) {
    return currentTenantId;
  }

  // Se já existe uma promise em andamento, aguarda ela
  if (tenantIdPromise) {
    return tenantIdPromise;
  }

  // Cria nova promise para resolver o tenant
  tenantIdPromise = (async () => {
    try {
      const subdomain = getCurrentSubdomain();
      if (!subdomain) {
        return null;
      }

      const tenant = await resolveTenantBySlug(subdomain);
      currentTenantId = tenant?.id || null;
      return currentTenantId;
    } catch (error) {
      console.error('Erro ao obter tenant_id:', error);
      return null;
    } finally {
      tenantIdPromise = null;
    }
  })();

  return tenantIdPromise;
}

/**
 * Limpa o cache do tenant_id (útil quando muda de subdomain)
 */
export function clearTenantIdCache(): void {
  currentTenantId = null;
  tenantIdPromise = null;
}

/**
 * Define manualmente o tenant_id (útil após login/registro)
 */
export function setCurrentTenantId(tenantId: string | null): void {
  currentTenantId = tenantId;
}

/**
 * Cliente Supabase com injeção automática de tenant_id
 */
export class TenantSupabaseClient {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  /**
   * Cria uma query com tenant_id automaticamente injetado
   */
  async from(table: string) {
    const tenantId = await getCurrentTenantId();
    
    const query = this.client.from(table);
    
    // Se estamos em um contexto de tenant, adiciona o filtro automaticamente
    if (tenantId) {
      return {
        ...query,
        select: (columns = '*') => {
          return query.select(columns).eq('tenant_id', tenantId);
        },
        insert: (values: any) => {
          // Injeta tenant_id automaticamente nos inserts
          const valuesWithTenant = Array.isArray(values) 
            ? values.map(v => ({ ...v, tenant_id: tenantId }))
            : { ...values, tenant_id: tenantId };
          
          return query.insert(valuesWithTenant);
        },
        update: (values: any) => {
          return query.update(values).eq('tenant_id', tenantId);
        },
        delete: () => {
          return query.delete().eq('tenant_id', tenantId);
        },
        upsert: (values: any) => {
          const valuesWithTenant = Array.isArray(values) 
            ? values.map(v => ({ ...v, tenant_id: tenantId }))
            : { ...values, tenant_id: tenantId };
          
          return query.upsert(valuesWithTenant);
        }
      };
    }

    // Se não há tenant, retorna query normal
    return query;
  }

  /**
   * Acesso direto ao cliente para operações que não precisam de tenant
   */
  get auth() {
    return this.client.auth;
  }

  get functions() {
    return this.client.functions;
  }

  get storage() {
    return this.client.storage;
  }

  get realtime() {
    return this.client.realtime;
  }

  /**
   * Query raw sem injeção de tenant_id
   */
  rawFrom(table: string) {
    return this.client.from(table);
  }

  /**
   * RPC calls
   */
  rpc(fn: string, args?: any) {
    return this.client.rpc(fn, args);
  }
}

// Instância global do cliente com tenant
export const tenantSupabase = new TenantSupabaseClient();

/**
 * Hook para usar o cliente com tenant context
 */
export function useSupabaseWithTenant() {
  return tenantSupabase;
}

/**
 * Função utilitária para queries que precisam de tenant_id específico
 */
export async function queryWithTenant(table: string, tenantId: string) {
  return supabase.from(table).select('*').eq('tenant_id', tenantId);
}

/**
 * Função utilitária para inserir dados com tenant_id
 */
export async function insertWithTenant(table: string, data: any, tenantId?: string) {
  const finalTenantId = tenantId || await getCurrentTenantId();
  
  if (!finalTenantId) {
    throw new Error('Tenant ID não encontrado');
  }

  const dataWithTenant = Array.isArray(data) 
    ? data.map(item => ({ ...item, tenant_id: finalTenantId }))
    : { ...data, tenant_id: finalTenantId };

  return supabase.from(table).insert(dataWithTenant);
}

/**
 * Função utilitária para atualizar dados com tenant_id
 */
export async function updateWithTenant(
  table: string, 
  data: any, 
  filters: Record<string, any>, 
  tenantId?: string
) {
  const finalTenantId = tenantId || await getCurrentTenantId();
  
  if (!finalTenantId) {
    throw new Error('Tenant ID não encontrado');
  }

  let query = supabase.from(table).update(data).eq('tenant_id', finalTenantId);
  
  // Aplicar filtros adicionais
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return query;
}

/**
 * Função utilitária para deletar dados com tenant_id
 */
export async function deleteWithTenant(
  table: string, 
  filters: Record<string, any>, 
  tenantId?: string
) {
  const finalTenantId = tenantId || await getCurrentTenantId();
  
  if (!finalTenantId) {
    throw new Error('Tenant ID não encontrado');
  }

  let query = supabase.from(table).delete().eq('tenant_id', finalTenantId);
  
  // Aplicar filtros adicionais
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  return query;
}