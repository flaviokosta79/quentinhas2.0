import { useState } from "react"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FoodCard } from "@/components/ui/food-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus } from "lucide-react"

// Mock data for demonstration
const quentinhaSizes = [
  { id: 'p', name: 'Quentinha P', price: 15.00, description: 'Ideal para quem quer matar a fome' },
  { id: 'm', name: 'Quentinha M', price: 18.00, description: 'Perfeita para uma refeição completa' },
  { id: 'g', name: 'Quentinha G', price: 20.00, description: 'Para quem tem um bom apetite' },
]

const categories = {
  base: {
    name: 'Base',
    maxSelections: 1,
    items: [
      { id: 'arroz', name: 'Arroz Branco', description: 'Arroz soltinho e temperado' },
      { id: 'arroz_integral', name: 'Arroz Integral', description: 'Opção mais saudável e nutritiva' },
    ]
  },
  proteina: {
    name: 'Proteína',
    maxSelections: 1,
    items: [
      { id: 'frango_grelhado', name: 'Frango Grelhado', description: 'Peito de frango temperado e grelhado' },
      { id: 'carne_moida', name: 'Carne Moída', description: 'Carne moída refogada com temperos' },
      { id: 'peixe', name: 'Peixe Grelhado', description: 'Filé de peixe grelhado com ervas' },
    ]
  },
  acompanhamentos: {
    name: 'Acompanhamentos',
    maxSelections: 2,
    items: [
      { id: 'feijao', name: 'Feijão Carioca', description: 'Feijão temperado tradicional' },
      { id: 'feijao_preto', name: 'Feijão Preto', description: 'Feijão preto cremoso' },
      { id: 'farofa', name: 'Farofa', description: 'Farofa crocante com bacon' },
      { id: 'batata_frita', name: 'Batata Frita', description: 'Batatas douradas e crocantes' },
    ]
  },
  salada: {
    name: 'Salada',
    maxSelections: 3,
    items: [
      { id: 'alface', name: 'Alface', description: 'Folhas frescas e crocantes' },
      { id: 'tomate', name: 'Tomate', description: 'Tomates frescos em cubos' },
      { id: 'cenoura', name: 'Cenoura Ralada', description: 'Cenoura fresca ralada' },
      { id: 'pepino', name: 'Pepino', description: 'Pepino em fatias finas' },
    ]
  }
}

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({})
  const [cartCount, setCartCount] = useState(0)
  const [showOrderForm, setShowOrderForm] = useState(false)

  const handleItemSelect = (categoryId: string, itemId: string) => {
    const category = categories[categoryId as keyof typeof categories]
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
    const size = quentinhaSizes.find(s => s.id === selectedSize)
    return size?.price || 0
  }

  const canAddToCart = () => {
    return selectedSize && 
           selectedItems.base?.length > 0 && 
           selectedItems.proteina?.length > 0
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
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                    <span>Escolha o Tamanho</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {quentinhaSizes.map((size) => (
                      <FoodCard
                        key={size.id}
                        name={size.name}
                        description={size.description}
                        price={size.price}
                        variant="selectable"
                        selected={selectedSize === size.id}
                        onSelect={() => setSelectedSize(size.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Choose Items */}
              {selectedSize && (
                <div className="space-y-6 animate-fade-in">
                  {Object.entries(categories).map(([categoryId, category]) => (
                    <Card key={categoryId}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                              {Object.keys(categories).indexOf(categoryId) + 2}
                            </span>
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="outline">
                            Escolha até {category.maxSelections}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {category.items.map((item) => (
                            <FoodCard
                              key={item.id}
                              name={item.name}
                              description={item.description}
                              variant="selectable"
                              selected={selectedItems[categoryId]?.includes(item.id) || false}
                              onSelect={() => handleItemSelect(categoryId, item.id)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

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
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Index
