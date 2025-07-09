import { ShoppingCart, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import logoImage from "@/assets/logo-quentinhas.jpg"

interface HeaderProps {
  cartItemsCount?: number
  onCartClick?: () => void
  restaurantName?: string
  isOpen?: boolean
  deliveryTime?: string
  location?: string
}

export function Header({ 
  cartItemsCount = 0, 
  onCartClick, 
  restaurantName = "Quentinhas Express",
  isOpen = true,
  deliveryTime = "30-45 min",
  location = "Centro, São Paulo"
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Restaurant Info */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Quentinhas Logo" 
              className="h-12 w-12 rounded-xl object-cover shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">{restaurantName}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className={`h-2 w-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{isOpen ? 'Aberto' : 'Fechado'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Restaurant Info */}
          <div className="flex flex-col items-center sm:hidden">
            <h1 className="text-base font-bold text-foreground">{restaurantName}</h1>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant={isOpen ? "default" : "destructive"} className="h-5 text-xs">
                {isOpen ? 'Aberto' : 'Fechado'}
              </Badge>
              <span>{deliveryTime}</span>
            </div>
          </div>

          {/* Cart Button */}
          <Button
            variant="outline"
            size="sm"
            className="relative p-2 hover:bg-primary hover:text-primary-foreground"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs font-bold animate-bounce-in"
              >
                {cartItemsCount}
              </Badge>
            )}
            <span className="sr-only">Carrinho de compras</span>
          </Button>
        </div>
      </div>
    </header>
  )
}