import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FoodCardProps {
  name: string
  description?: string
  price?: number
  image?: string
  selected?: boolean
  onSelect?: () => void
  variant?: "default" | "selectable" | "category"
  className?: string
}

const FoodCard = React.forwardRef<HTMLDivElement, FoodCardProps>(
  ({ name, description, price, image, selected, onSelect, variant = "default", className, ...props }, ref) => {
    const isSelectable = variant === "selectable"
    const isCategory = variant === "category"

    return (
      <Card
        ref={ref}
        className={cn(
          "group overflow-hidden border-0 bg-card shadow-[var(--shadow-food-card)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elegant)] hover:scale-[1.02]",
          isSelectable && "cursor-pointer",
          selected && "ring-2 ring-primary ring-offset-2 shadow-[var(--shadow-glow)]",
          isCategory && "bg-gradient-to-br from-primary/5 to-secondary/5",
          className
        )}
        onClick={isSelectable ? onSelect : undefined}
        {...props}
      >
        <CardContent className="p-0">
          {image && (
            <div className="relative h-32 w-full overflow-hidden">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {price && (
                <div className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                  R$ {price.toFixed(2).replace('.', ',')}
                </div>
              )}
            </div>
          )}
          
          <div className="p-4">
            <h3 className={cn(
              "font-semibold leading-tight",
              isCategory ? "text-lg text-primary" : "text-base text-foreground"
            )}>
              {name}
            </h3>
            
            {description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            
            {price && !image && (
              <p className="mt-2 text-lg font-bold text-primary">
                R$ {price.toFixed(2).replace('.', ',')}
              </p>
            )}
            
            {isSelectable && (
              <Button
                variant={selected ? "default" : "outline"}
                size="sm"
                className="mt-3 w-full transition-[var(--transition-bounce)]"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect?.()
                }}
              >
                {selected ? "Selecionado" : "Selecionar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

FoodCard.displayName = "FoodCard"

export { FoodCard }