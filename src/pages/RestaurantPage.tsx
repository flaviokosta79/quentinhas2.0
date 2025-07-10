import React, { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FoodCard } from "@/components/ui/food-card"
import { IngredientListItem } from "@/components/ui/ingredient-list-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, AlertCircle } from "lucide-react"
import { useTenant, useTenantSettings } from "../shared/contexts/tenant-context"
import { getProducts, getCategories } from "../services/data/product-service"
import type { Product, Category } from "../shared/types"

interface SelectedItems {
  [categoryId: string]: string[]
}

const RestaurantPage = () => {
  const { tenant, isLoading: tenantLoading } = useTenant()
  const { settings, isRestaurantOpen } = useTenantSettings()
  
  // State for products and categories
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for order building
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({})
  const [cartCount, setCartCount] = useState(0)
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Load products and categories when tenant is available
  useEffect(() => {
    const loadData = async () => {
      if (!tenant?.id) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const [productsData, categoriesData] = await Promise.all([
          getProducts(tenant.id),
          getCategories(tenant.id)
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error loading restaurant data:', err)
        setError('Erro ao carregar dados do restaurante')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tenant?.id])

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    const grouped: Record<string, Product[]> = {}
    products.forEach(product => {
      if (!grouped[product.categoryId]) {
        grouped[product.categoryId] = []
      }
      grouped[product.categoryId].push(product)
    })
    return grouped
  }, [products])

  // Find size products (assuming there's a category for sizes)
  const sizeCategory = categories.find(cat => 
    cat.name.toLowerCase().includes('tamanho') || 
    cat.name.toLowerCase().includes('size') ||
    cat.name.toLowerCase().includes('quentinha')
  )
  const sizeProducts = sizeCategory ? productsByCategory[sizeCategory.id] || [] : []

  const handleItemSelect = (categoryId: string, itemId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return
    
    const currentSelections = selectedItems[categoryId] || []
    
    if (currentSelections.includes(itemId)) {
      // Remove item
      setSelectedItems(prev => ({
        ...prev,
        [categoryId]: currentSelections.filter(id => id !== itemId)
      }))
    } else {
      // Add item (respect max selections)
      if (currentSelections.length < category.maxSelections) {
        setSelectedItems(prev => ({
          ...prev,
          [categoryId]: [...currentSelections, itemId]
        }))
      }
    }
  }

  const getSelectedPrice = () => {
    const sizeProduct = sizeProducts.find(p => p.id === selectedSize)
    return sizeProduct?.price || 0
  }

  const canAddToCart = () => {
    // Check if we have a size selected
    if (!selectedSize) return false
    
    // Check if all required categories have selections
    const requiredCategories = categories.filter(cat => cat.minSelections > 0)
    return requiredCategories.every(category => {
      const selections = selectedItems[category.id] || []
      return selections.length >= category.minSelections
    })
  }

  const handleAddToCart = () => {
    if (canAddToCart()) {
      setCartCount(prev => prev + 1)
      // Reset selections
      setSelectedSize('')
      setSelectedItems({})
    }
  }

  const handleStartOrder = () => {
    setShowOrderForm(true)
    // Scroll to order form
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Loading state
  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar cardápio</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  // Restaurant closed state
  if (!isRestaurantOpen()) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemsCount={cartCount} />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">🕐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {settings.restaurantName} está fechado
            </h1>
            <p className="text-gray-600 mb-4">
              Voltamos em breve! Confira nossos horários de funcionamento.
            </p>
            <div className="text-sm text-gray-500">
              <p>Tempo de entrega: {settings.deliveryTime}</p>
              <p>Taxa de entrega: R$ {settings.deliveryFee.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={cartCount} />
      
      <main>
        <HeroSection onStartOrder={handleStartOrder} />
        
        {/* Order Form Section */}
        <section id="order-form" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Step 1: Choose Size */}
              {sizeProducts.length > 0 && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                      <span>Escolha o Tamanho</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {sizeProducts.map((product) => (
                        <FoodCard
                          key={product.id}
                          name={product.name}
                          description={product.description}
                          price={product.price}
                          image={product.imageUrl}
                          variant="selectable"
                          selected={selectedSize === product.id}
                          onSelect={() => setSelectedSize(product.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Choose Items by Category */}
              {selectedSize && categories.filter(cat => cat.id !== sizeCategory?.id).map((category, index) => {
                const categoryProducts = productsByCategory[category.id] || []
                
                if (categoryProducts.length === 0) return null

                return (
                  <Card key={category.id} className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                            {index + 2}
                          </span>
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="outline">
                          {category.minSelections > 0 
                            ? `Escolha ${category.minSelections} a ${category.maxSelections}`
                            : `Escolha até ${category.maxSelections}`
                          }
                        </Badge>
                      </CardTitle>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryProducts.map((product) => {
                          const currentSelections = selectedItems[category.id] || []
                          const isSelected = currentSelections.includes(product.id)
                          const isDisabled = !isSelected && currentSelections.length >= category.maxSelections
                          
                          return (
                            <IngredientListItem
                              key={product.id}
                              name={product.name}
                              description={product.description}
                              image={product.imageUrl}
                              selected={isSelected}
                              disabled={isDisabled}
                              onSelect={() => handleItemSelect(category.id, product.id)}
                            />
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Add to Cart */}
              {selectedSize && (
                <Card className="sticky bottom-4 shadow-[var(--shadow-elegant)] animate-slide-up">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">Total: R$ {getSelectedPrice().toFixed(2).replace('.', ',')}</p>
                        <p className="text-sm text-muted-foreground">
                          {Object.values(selectedItems).flat().length} itens selecionados
                        </p>
                      </div>
                      <Button
                        size="lg"
                        disabled={!canAddToCart()}
                        onClick={handleAddToCart}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-primary text-white font-semibold"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No products message */}
              {categories.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">🍽️</div>
                    <h3 className="text-lg font-semibold mb-2">Cardápio em preparação</h3>
                    <p className="text-muted-foreground">
                      Estamos preparando nosso delicioso cardápio. Volte em breve!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default RestaurantPage