import type { TenantTheme } from '../../shared/types';
import { DEFAULT_THEME, THEME_PRESETS, validateTheme, mergeWithDefaultTheme } from '../../shared/constants';

// Cache for theme data
const themeCache = new Map<string, { theme: TenantTheme; timestamp: number }>();

/**
 * Apply theme to document
 */
export function applyTheme(theme: TenantTheme): void {
  const root = document.documentElement;
  
  // Apply CSS custom properties
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  
  if (theme.colors.foreground) {
    root.style.setProperty('--color-foreground', theme.colors.foreground);
  }
  
  if (theme.colors.muted) {
    root.style.setProperty('--color-muted', theme.colors.muted);
  }
  
  // Apply fonts
  root.style.setProperty('--font-primary', theme.fonts.primary);
  root.style.setProperty('--font-secondary', theme.fonts.secondary);
  
  // Update favicon if provided
  if (theme.favicon) {
    updateFavicon(theme.favicon);
  }
  
  // Apply custom CSS if provided
  if (theme.customCSS) {
    applyCustomCSS(theme.customCSS);
  }
  
  // Apply layout styles
  if (theme.layout) {
    applyLayoutStyles(theme.layout);
  }
}

/**
 * Update favicon
 */
function updateFavicon(faviconUrl: string): void {
  const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  
  if (existingFavicon) {
    existingFavicon.href = faviconUrl;
  } else {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);
  }
}

/**
 * Apply custom CSS
 */
function applyCustomCSS(customCSS: string): void {
  // Remove existing custom CSS
  const existingStyle = document.getElementById('tenant-custom-css');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new custom CSS
  const style = document.createElement('style');
  style.id = 'tenant-custom-css';
  style.textContent = customCSS;
  document.head.appendChild(style);
}

/**
 * Apply layout styles
 */
function applyLayoutStyles(layout: NonNullable<TenantTheme['layout']>): void {
  const root = document.documentElement;
  
  // Apply header style
  root.setAttribute('data-header-style', layout.headerStyle);
  
  // Apply footer style
  root.setAttribute('data-footer-style', layout.footerStyle);
}

/**
 * Reset theme to default
 */
export function resetTheme(): void {
  applyTheme(DEFAULT_THEME);
}

/**
 * Get theme from cache
 */
function getCachedTheme(tenantId: string): TenantTheme | null {
  const cached = themeCache.get(tenantId);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > 10 * 60 * 1000; // 10 minutes
  if (isExpired) {
    themeCache.delete(tenantId);
    return null;
  }
  
  return cached.theme;
}

/**
 * Cache theme
 */
function cacheTheme(tenantId: string, theme: TenantTheme): void {
  themeCache.set(tenantId, {
    theme,
    timestamp: Date.now()
  });
}

/**
 * Load and apply tenant theme
 */
export async function loadTenantTheme(tenantId: string, theme?: TenantTheme): Promise<void> {
  try {
    let tenantTheme: TenantTheme;
    
    if (theme) {
      tenantTheme = theme;
    } else {
      // Check cache first
      const cachedTheme = getCachedTheme(tenantId);
      if (cachedTheme) {
        tenantTheme = cachedTheme;
      } else {
        // In a real implementation, this would fetch from the database
        // For now, we'll use the default theme
        tenantTheme = DEFAULT_THEME;
      }
    }
    
    // Validate and merge with defaults
    const validatedTheme = validateTheme(tenantTheme) 
      ? tenantTheme 
      : mergeWithDefaultTheme(tenantTheme);
    
    // Cache the theme
    cacheTheme(tenantId, validatedTheme);
    
    // Apply the theme
    applyTheme(validatedTheme);
    
  } catch (error) {
    console.error('Error loading tenant theme:', error);
    // Fallback to default theme
    resetTheme();
  }
}

/**
 * Create theme from preset
 */
export function createThemeFromPreset(presetName: string, customizations?: Partial<TenantTheme>): TenantTheme {
  const preset = THEME_PRESETS[presetName as keyof typeof THEME_PRESETS];
  if (!preset) {
    throw new Error(`Theme preset "${presetName}" not found`);
  }
  
  return mergeWithDefaultTheme({
    ...preset,
    ...customizations
  });
}

/**
 * Generate CSS variables string from theme
 */
export function generateCSSVariables(theme: TenantTheme): string {
  const variables = [
    `--color-primary: ${theme.colors.primary}`,
    `--color-secondary: ${theme.colors.secondary}`,
    `--color-accent: ${theme.colors.accent}`,
    `--color-background: ${theme.colors.background}`,
    `--font-primary: ${theme.fonts.primary}`,
    `--font-secondary: ${theme.fonts.secondary}`
  ];
  
  if (theme.colors.foreground) {
    variables.push(`--color-foreground: ${theme.colors.foreground}`);
  }
  
  if (theme.colors.muted) {
    variables.push(`--color-muted: ${theme.colors.muted}`);
  }
  
  return `:root {\n  ${variables.join(';\n  ')};\n}`;
}

/**
 * Export theme as CSS file
 */
export function exportThemeAsCSS(theme: TenantTheme, filename = 'theme.css'): void {
  let css = generateCSSVariables(theme);
  
  if (theme.customCSS) {
    css = css + '\n\n' + theme.customCSS;
  }
  
  const blob = new Blob([css], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Preview theme without applying
 */
export function previewTheme(theme: TenantTheme, previewElement?: HTMLElement): void {
  const element = previewElement || document.body;
  
  // Create a temporary style element
  const style = document.createElement('style');
  style.id = 'theme-preview';
  
  const css = `
    .theme-preview {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --font-primary: ${theme.fonts.primary};
      --font-secondary: ${theme.fonts.secondary};
      ${theme.colors.foreground ? `--color-foreground: ${theme.colors.foreground};` : ''}
      ${theme.colors.muted ? `--color-muted: ${theme.colors.muted};` : ''}
    }
    ${theme.customCSS || ''}
  `;
  
  style.textContent = css;
  document.head.appendChild(style);
  
  // Add preview class to element
  element.classList.add('theme-preview');
}

/**
 * Stop theme preview
 */
export function stopThemePreview(previewElement?: HTMLElement): void {
  const element = previewElement || document.body;
  
  // Remove preview class
  element.classList.remove('theme-preview');
  
  // Remove preview style
  const previewStyle = document.getElementById('theme-preview');
  if (previewStyle) {
    previewStyle.remove();
  }
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Check if theme has good accessibility
 */
export function validateThemeAccessibility(theme: TenantTheme): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check contrast ratios
  const primaryBgContrast = getContrastRatio(theme.colors.primary, theme.colors.background);
  if (primaryBgContrast < 4.5) {
    issues.push('Primary color has insufficient contrast with background (minimum 4.5:1)');
  }
  
  const secondaryBgContrast = getContrastRatio(theme.colors.secondary, theme.colors.background);
  if (secondaryBgContrast < 4.5) {
    issues.push('Secondary color has insufficient contrast with background (minimum 4.5:1)');
  }
  
  if (theme.colors.foreground) {
    const foregroundBgContrast = getContrastRatio(theme.colors.foreground, theme.colors.background);
    if (foregroundBgContrast < 7) {
      issues.push('Foreground color has insufficient contrast with background (minimum 7:1 for text)');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Clear theme cache
 */
export function clearThemeCache(tenantId?: string): void {
  if (tenantId) {
    themeCache.delete(tenantId);
  } else {
    themeCache.clear();
  }
}