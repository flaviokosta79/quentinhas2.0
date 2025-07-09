import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

interface IngredientListItemProps {
  name: string
  description?: string
  image?: string
  selected?: boolean
  onSelect?: () => void
  disabled?: boolean
  className?: string
}

const IngredientListItem = React.forwardRef<HTMLDivElement, IngredientListItemProps>(
  ({ name, description, image, selected, onSelect, disabled, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "group overflow-hidden border border-border/50 bg-card transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-elegant)]",
          !disabled && "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={!disabled ? onSelect : undefined}
        {...props}
      >
        <div className="flex items-center p-3 gap-3">
          {/* Product Image */}
          {image && (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground leading-tight truncate">
              {name}
            </h4>
            {description && (
              <p className="text-sm text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          {/* Selection Switch */}
          <div className="flex-shrink-0">
            <Switch
              checked={selected}
              onCheckedChange={onSelect}
              disabled={disabled}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </Card>
    )
  }
)

IngredientListItem.displayName = "IngredientListItem"

export { IngredientListItem }