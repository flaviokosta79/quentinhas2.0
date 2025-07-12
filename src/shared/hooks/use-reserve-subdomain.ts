import { useState } from 'react';
import { 
  reserveSubdomain, 
  checkSlugAvailability, 
  validateSlugFormat,
  generateSlugSuggestions,
  redirectToTenantDomain,
  type ReserveSubdomainRequest,
  type ReserveSubdomainResponse 
} from '../../services/tenant/tenant-service';

interface UseReserveSubdomainState {
  isLoading: boolean;
  isCheckingAvailability: boolean;
  error: string | null;
  success: boolean;
  response: ReserveSubdomainResponse | null;
}

interface UseReserveSubdomainReturn extends UseReserveSubdomainState {
  reserveSubdomain: (data: ReserveSubdomainRequest) => Promise<ReserveSubdomainResponse>;
  checkAvailability: (slug: string) => Promise<boolean>;
  validateSlug: (slug: string) => { valid: boolean; error?: string };
  generateSuggestions: (name: string) => string[];
  redirectToTenant: (slug: string, path?: string) => void;
  reset: () => void;
}

export function useReserveSubdomain(): UseReserveSubdomainReturn {
  const [state, setState] = useState<UseReserveSubdomainState>({
    isLoading: false,
    isCheckingAvailability: false,
    error: null,
    success: false,
    response: null
  });

  const handleReserveSubdomain = async (data: ReserveSubdomainRequest): Promise<ReserveSubdomainResponse> => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      success: false,
      response: null 
    }));

    try {
      const response = await reserveSubdomain(data);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        success: response.success,
        error: response.success ? null : response.message,
        response
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        success: false,
        error: errorMessage,
        response: {
          success: false,
          message: errorMessage,
          error: errorMessage
        }
      }));

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    }
  };

  const handleCheckAvailability = async (slug: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isCheckingAvailability: true }));

    try {
      const isAvailable = await checkSlugAvailability(slug);
      setState(prev => ({ ...prev, isCheckingAvailability: false }));
      return isAvailable;
    } catch (error) {
      setState(prev => ({ ...prev, isCheckingAvailability: false }));
      return false;
    }
  };

  const handleValidateSlug = (slug: string) => {
    return validateSlugFormat(slug);
  };

  const handleGenerateSuggestions = (name: string) => {
    return generateSlugSuggestions(name);
  };

  const handleRedirectToTenant = (slug: string, path?: string) => {
    redirectToTenantDomain(slug, path);
  };

  const reset = () => {
    setState({
      isLoading: false,
      isCheckingAvailability: false,
      error: null,
      success: false,
      response: null
    });
  };

  return {
    ...state,
    reserveSubdomain: handleReserveSubdomain,
    checkAvailability: handleCheckAvailability,
    validateSlug: handleValidateSlug,
    generateSuggestions: handleGenerateSuggestions,
    redirectToTenant: handleRedirectToTenant,
    reset
  };
}