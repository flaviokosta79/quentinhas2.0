export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  maxSelections: number;
  minSelections: number;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  ingredients: string[];
  nutritionalInfo: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuentinhaSize {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface ProductCreateInput {
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  sortOrder?: number;
}

export interface CategoryCreateInput {
  tenantId: string;
  name: string;
  description?: string;
  maxSelections?: number;
  minSelections?: number;
  sortOrder?: number;
}

// Dados hardcoded atuais para migração
export const DEFAULT_QUENTINHA_SIZES: QuentinhaSize[] = [
  { id: 'p', name: 'Quentinha P', price: 15.00, description: 'Ideal para quem quer matar a fome' },
  { id: 'm', name: 'Quentinha M', price: 18.00, description: 'Perfeita para uma refeição completa' },
  { id: 'g', name: 'Quentinha G', price: 20.00, description: 'Para quem tem um bom apetite' },
];