import { createClient } from '@supabase/supabase-js';
import type { Tenant, TenantCreateInput } from '../../shared/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../shared/constants';

// Cliente Supabase sem tipagem específica para evitar conflitos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrsjmbzmvngzhdaofhsg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyc2ptYnptdm5nemhkYW9maHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTgzNzYsImV4cCI6MjA2NzY3NDM3Nn0.hzHI72U_2nw9Rs1Moyfmub6-i5A77XCHxjoDfUG7-jw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ReserveSubdomainRequest {
  slug: string;
  tenantName: string;
  email: string;
  phone?: string;
  plan?: 'starter' | 'professional' | 'enterprise';
}

export interface ReserveSubdomainResponse {
  success: boolean;
  tenantId?: string;
  slug?: string;
  message: string;
  error?: string;
}

/**
 * Reserva um subdomínio e cria um novo tenant
 */
export async function reserveSubdomain(
  data: ReserveSubdomainRequest
): Promise<ReserveSubdomainResponse> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Usuário não autenticado');
    }

    // Chamar a Edge Function
    const { data: response, error } = await supabase.functions.invoke('reserve-subdomain', {
      body: data,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Erro na Edge Function:', error);
      throw new Error(error.message || 'Erro ao reservar subdomínio');
    }

    return response as ReserveSubdomainResponse;
  } catch (error) {
    console.error('Erro ao reservar subdomínio:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Verifica se um slug está disponível
 */
export async function checkSlugAvailability(slug: string): Promise<boolean> {
  try {
    if (!slug || slug.trim().length === 0) {
      return false;
    }

    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', slug.toLowerCase().trim())
      .single();

    if (error && error.code === 'PGRST116') {
      // Nenhum registro encontrado - slug disponível
      return true;
    }

    if (error) {
      console.error('Erro ao verificar disponibilidade do slug:', error);
      return false;
    }

    // Se encontrou um registro, slug não está disponível
    return !data;
  } catch (error) {
    console.error('Erro ao verificar slug:', error);
    return false;
  }
}

/**
 * Valida formato do slug
 */
export function validateSlugFormat(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Nome não pode estar vazio' };
  }

  const cleanSlug = slug.toLowerCase().trim();

  if (cleanSlug.length < 3 || cleanSlug.length > 30) {
    return { valid: false, error: 'Nome deve ter entre 3 e 30 caracteres' };
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(cleanSlug)) {
    return { valid: false, error: 'Use apenas letras, números e hífens' };
  }

  if (cleanSlug.startsWith('-') || cleanSlug.endsWith('-')) {
    return { valid: false, error: 'Não pode começar ou terminar com hífen' };
  }

  // Palavras reservadas
  const reservedSlugs = [
    'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop',
    'store', 'support', 'help', 'docs', 'dev', 'test', 'staging',
    'prod', 'production', 'dashboard', 'panel', 'login', 'register',
    'auth', 'oauth', 'cdn', 'static', 'assets', 'images', 'files',
    'uploads', 'download', 'secure', 'ssl', 'vpn', 'proxy',
    'quentinhas', 'quentinha', 'delivery', 'food', 'restaurant'
  ];

  if (reservedSlugs.includes(cleanSlug)) {
    return { valid: false, error: 'Este nome não está disponível' };
  }

  return { valid: true };
}

/**
 * Gera sugestões de slug baseadas no nome do restaurante
 */
export function generateSlugSuggestions(restaurantName: string): string[] {
  if (!restaurantName || restaurantName.trim().length === 0) {
    return [];
  }

  const baseName = restaurantName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, ''); // Remove hífens do início e fim

  const suggestions: string[] = [];

  // Sugestão principal
  if (baseName.length >= 3) {
    suggestions.push(baseName);
  }

  // Sugestões com sufixos
  const suffixes = ['delivery', 'food', 'express', 'gourmet', 'casa', 'restaurante'];
  suffixes.forEach(suffix => {
    const suggestion = `${baseName}-${suffix}`;
    if (suggestion.length <= 30) {
      suggestions.push(suggestion);
    }
  });

  // Sugestões com números
  for (let i = 1; i <= 5; i++) {
    const suggestion = `${baseName}${i}`;
    if (suggestion.length <= 30) {
      suggestions.push(suggestion);
    }
  }

  // Sugestões abreviadas se o nome for muito longo
  if (baseName.length > 15) {
    const words = baseName.split('-');
    if (words.length > 1) {
      const abbreviated = words.map(word => word.charAt(0)).join('');
      if (abbreviated.length >= 3) {
        suggestions.push(abbreviated);
        suggestions.push(`${abbreviated}-delivery`);
      }
    }
  }

  return suggestions.slice(0, 8); // Máximo 8 sugestões
}

/**
 * Redireciona para o subdomínio do tenant
 */
export function redirectToTenantDomain(slug: string, path: string = '/dashboard'): void {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const baseDomain = import.meta.env.DEV ? 'localhost' : 'quentinhas.com';
  
  const url = `${protocol}//${slug}.${baseDomain}${port}${path}`;
  
  console.log('🔄 Redirecionando para:', url);
  window.location.href = url;
}

/**
 * Obtém a URL do tenant
 */
export function getTenantUrl(slug: string, path: string = ''): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const baseDomain = import.meta.env.DEV ? 'localhost' : 'quentinhas.com';
  
  return `${protocol}//${slug}.${baseDomain}${port}${path}`;
}

/**
 * Obtém a URL do domínio principal
 */
export function getMainDomainUrl(path: string = ''): string {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const baseDomain = import.meta.env.DEV ? 'localhost' : 'quentinhas.com';
  
  return `${protocol}//${baseDomain}${port}${path}`;
}