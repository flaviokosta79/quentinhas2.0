import { Button } from "@/components/ui/button"
import { Clock, Star, Truck } from "lucide-react"
import heroImage from "@/assets/hero-quentinha.jpg"

interface HeroSectionProps {
  onStartOrder?: () => void
}

export function HeroSection({ onStartOrder }: HeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left animate-fade-in">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Quentinhas
                </span>{" "}
                <span className="text-foreground">fresquinhas</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
                Monte sua quentinha do jeito que você gosta! Escolha entre os melhores ingredientes e receba rapidinho na sua casa.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">Entrega em 30-45min</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                  <Star className="h-4 w-4 text-accent" />
                </div>
                <span className="text-muted-foreground">4.9 ⭐ (1,200+ avaliações)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                  <Truck className="h-4 w-4 text-secondary" />
                </div>
                <span className="text-muted-foreground">Frete grátis acima de R$ 25</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-primary text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-[var(--shadow-glow)] hover:scale-105 transition-[var(--transition-bounce)]"
                onClick={onStartOrder}
              >
                Montar Minha Quentinha
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)]">
              <img
                src={heroImage}
                alt="Delicious quentinha with rice, beans, chicken and salad"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Price Card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-[var(--shadow-elegant)] animate-bounce-in">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">A partir de</p>
                <p className="text-2xl font-bold text-primary">R$ 15,00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}