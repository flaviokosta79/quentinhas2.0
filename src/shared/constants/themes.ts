import { TenantTheme } from '../types/tenant';

export const DEFAULT_THEME: TenantTheme = {
  colors: {
    primary: '#FF6B35',
    secondary: '#E63946',
    accent: '#F77F00',
    background: '#FFFFFF',
    foreground: '#1A1A1A',
    muted: '#F5F5F5'
  },
  logo: '/assets/logo-quentinhas.jpg',
  fonts: {
    primary: 'Inter',
    secondary: 'Inter'
  },
  layout: {
    headerStyle: 'default',
    footerStyle: 'default'
  }
};

export const THEME_PRESETS: Record<string, TenantTheme> = {
  default: DEFAULT_THEME,
  
  modern: {
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#111827',
      muted: '#F9FAFB'
    },
    logo: '',
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    layout: {
      headerStyle: 'minimal',
      footerStyle: 'minimal'
    }
  },
  
  warm: {
    colors: {
      primary: '#DC2626',
      secondary: '#EA580C',
      accent: '#D97706',
      background: '#FEF7ED',
      foreground: '#1C1917',
      muted: '#FED7AA'
    },
    logo: '',
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    layout: {
      headerStyle: 'default',
      footerStyle: 'default'
    }
  },
  
  elegant: {
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#111827',
      muted: '#F3F4F6'
    },
    logo: '',
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    layout: {
      headerStyle: 'centered',
      footerStyle: 'minimal'
    }
  },
  
  fresh: {
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#064E3B',
      muted: '#ECFDF5'
    },
    logo: '',
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    layout: {
      headerStyle: 'default',
      footerStyle: 'default'
    }
  }
};

export const AVAILABLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Nunito'
];

export const getThemePreset = (presetName: string): TenantTheme => {
  return THEME_PRESETS[presetName] || DEFAULT_THEME;
};

export const validateTheme = (theme: Partial<TenantTheme>): boolean => {
  // Validações básicas do tema
  if (theme.colors) {
    const requiredColors = ['primary', 'secondary', 'accent', 'background'];
    for (const color of requiredColors) {
      if (!theme.colors[color as keyof typeof theme.colors]) {
        return false;
      }
    }
  }
  
  if (theme.fonts) {
    if (!theme.fonts.primary || !theme.fonts.secondary) {
      return false;
    }
  }
  
  return true;
};

export const mergeWithDefaultTheme = (theme: Partial<TenantTheme>): TenantTheme => {
  return {
    colors: { ...DEFAULT_THEME.colors, ...theme.colors },
    logo: theme.logo || DEFAULT_THEME.logo,
    favicon: theme.favicon || DEFAULT_THEME.favicon,
    fonts: { ...DEFAULT_THEME.fonts, ...theme.fonts },
    customCSS: theme.customCSS || DEFAULT_THEME.customCSS,
    layout: { ...DEFAULT_THEME.layout, ...theme.layout }
  };
};