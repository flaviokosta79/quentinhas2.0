import { createClient } from '@supabase/supabase-js';
import type { Product, Category, ProductCreateInput, CategoryCreateInput } from '../../shared/types';
import { ERROR_MESSAGES } from '../../shared/constants';

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cache for product data
const productCache = new Map<string, { products: Product[]; timestamp: number }>();
const categoryCache = new Map<string, { categories: Category[]; timestamp: number }>();

/**
 * Get cached products for a tenant
 */
function getCachedProducts(tenantId: string): Product[] | null {
  const cached = productCache.get(tenantId);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000; // 5 minutes
  if (isExpired) {
    productCache.delete(tenantId);
    return null;
  }
  
  return cached.products;
}

/**
 * Cache products for a tenant
 */
function cacheProducts(tenantId: string, products: Product[]): void {
  productCache.set(tenantId, {
    products,
    timestamp: Date.now()
  });
}

/**
 * Get cached categories for a tenant
 */
function getCachedCategories(tenantId: string): Category[] | null {
  const cached = categoryCache.get(tenantId);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000; // 5 minutes
  if (isExpired) {
    categoryCache.delete(tenantId);
    return null;
  }
  
  return cached.categories;
}

/**
 * Cache categories for a tenant
 */
function cacheCategories(tenantId: string, categories: Category[]): void {
  categoryCache.set(tenantId, {
    categories,
    timestamp: Date.now()
  });
}

/**
 * Get all categories for a tenant
 */
export async function getCategories(tenantId: string): Promise<Category[]> {
  try {
    // Check cache first
    const cachedCategories = getCachedCategories(tenantId);
    if (cachedCategories) {
      return cachedCategories;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    const categories: Category[] = data.map(item => ({
      id: item.id,
      tenantId: item.tenant_id,
      name: item.name,
      description: item.description,
      maxSelections: item.max_selections || 1,
      minSelections: item.min_selections || 0,
      sortOrder: item.sort_order || 0,
      active: item.active,
      createdAt: item.created_at
    }));

    // Cache the results
    cacheCategories(tenantId, categories);

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Get all products for a tenant
 */
export async function getProducts(tenantId: string, categoryId?: string): Promise<Product[]> {
  try {
    // Check cache first (only if no category filter)
    if (!categoryId) {
      const cachedProducts = getCachedProducts(tenantId);
      if (cachedProducts) {
        return cachedProducts;
      }
    }

    let query = supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    const products: Product[] = data.map(item => ({
      id: item.id,
      tenantId: item.tenant_id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.image_url,
      ingredients: item.ingredients || [],
      nutritionalInfo: item.nutritional_info || {},
      active: item.active,
      sortOrder: item.sort_order || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    // Cache the results (only if no category filter)
    if (!categoryId) {
      cacheProducts(tenantId, products);
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(tenantId: string, productId: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return {
      id: data.id,
      tenantId: data.tenant_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.image_url,
      ingredients: data.ingredients || [],
      nutritionalInfo: data.nutritional_info || {},
      active: data.active,
      sortOrder: data.sort_order || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Create a new category
 */
export async function createCategory(tenantId: string, categoryData: CategoryCreateInput): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        tenant_id: tenantId,
        name: categoryData.name,
        description: categoryData.description,
        max_selections: categoryData.maxSelections || 1,
        min_selections: categoryData.minSelections || 0,
        sort_order: categoryData.sortOrder || 0,
        active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clear cache
    categoryCache.delete(tenantId);

    return {
      id: data.id,
      tenantId: data.tenant_id,
      name: data.name,
      description: data.description,
      maxSelections: data.max_selections,
      minSelections: data.min_selections,
      sortOrder: data.sort_order,
      active: data.active,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Create a new product
 */
export async function createProduct(tenantId: string, productData: ProductCreateInput): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenantId,
        category_id: productData.categoryId,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.imageUrl,
        ingredients: productData.ingredients || [],
        nutritional_info: productData.nutritionalInfo || {},
        sort_order: productData.sortOrder || 0,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clear cache
    productCache.delete(tenantId);

    return {
      id: data.id,
      tenantId: data.tenant_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.image_url,
      ingredients: data.ingredients,
      nutritionalInfo: data.nutritional_info,
      active: data.active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Update a category
 */
export async function updateCategory(tenantId: string, categoryId: string, updates: Partial<Category>): Promise<Category> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        description: updates.description,
        max_selections: updates.maxSelections,
        min_selections: updates.minSelections,
        sort_order: updates.sortOrder,
        active: updates.active
      })
      .eq('tenant_id', tenantId)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clear cache
    categoryCache.delete(tenantId);

    return {
      id: data.id,
      tenantId: data.tenant_id,
      name: data.name,
      description: data.description,
      maxSelections: data.max_selections,
      minSelections: data.min_selections,
      sortOrder: data.sort_order,
      active: data.active,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Update a product
 */
export async function updateProduct(tenantId: string, productId: string, updates: Partial<Product>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        category_id: updates.categoryId,
        name: updates.name,
        description: updates.description,
        price: updates.price,
        image_url: updates.imageUrl,
        ingredients: updates.ingredients,
        nutritional_info: updates.nutritionalInfo,
        sort_order: updates.sortOrder,
        active: updates.active,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clear cache
    productCache.delete(tenantId);

    return {
      id: data.id,
      tenantId: data.tenant_id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.image_url,
      ingredients: data.ingredients,
      nutritionalInfo: data.nutritional_info,
      active: data.active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(tenantId: string, categoryId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', categoryId);

    if (error) {
      throw error;
    }

    // Clear cache
    categoryCache.delete(tenantId);
    productCache.delete(tenantId);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(tenantId: string, productId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('id', productId);

    if (error) {
      throw error;
    }

    // Clear cache
    productCache.delete(tenantId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Search products
 */
export async function searchProducts(tenantId: string, query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      tenantId: item.tenant_id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.image_url,
      ingredients: item.ingredients || [],
      nutritionalInfo: item.nutritional_info || {},
      active: item.active,
      sortOrder: item.sort_order || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * Clear cache for a tenant
 */
export function clearProductCache(tenantId: string): void {
  productCache.delete(tenantId);
  categoryCache.delete(tenantId);
}

/**
 * Clear all cache
 */
export function clearAllProductCache(): void {
  productCache.clear();
  categoryCache.clear();
}