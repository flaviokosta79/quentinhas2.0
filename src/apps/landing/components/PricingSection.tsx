import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown,
  Calculator,
  TrendingUp,
  DollarSign,
  ArrowRight
} from 'lucide-react';

/**
 * Pricing Section Component
 * Shows pricing plans with comparison and ROI calculator
 */
const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [monthlyOrders, setMonthlyOrders] = useState(100);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfeito para começar',
      monthlyPrice: 99,
      annualPrice: 89,
      popular: false,
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Loja online personalizada',
        'Até 100 pedidos/mês',
        'WhatsApp integrado',
        'Dashboard básico',
        'Suporte por email',
        'Pagamentos PIX e cartão',
        'Relatórios básicos'
      ],
      limitations: [
        'Sem personalização avançada',
        'Sem integração com delivery',
        'Sem API personalizada'
      ],
      limits: {
        orders: 100,
        products: 50,
        categories: 10
      }
    },
    {
      name: 'Professional',
      description: 'Mais vendido pelos restaurantes',
      monthlyPrice: 199,
      annualPrice: 179,
      popular: true,
      icon: Star,
      color: 'from-orange-500 to-red-500',
      features: [
        'Tudo do plano Starter',
        'Até 500 pedidos/mês',
        'Personalização completa',
        'Dashboard avançado',
        'Suporte prioritário',
        'Integração com delivery',
        'Analytics detalhados',
        'Múltiplos usuários',
        'Backup automático'
      ],
      limitations: [
        'Sem white label',
        'Sem API personalizada'
      ],
      limits: {
        orders: 500,
        products: 200,
        categories: 25
      }
    },
    {
      name: 'Enterprise',
      description: 'Para grandes operações',
      monthlyPrice: 399,
      annualPrice: 359,
      popular: false,
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Tudo do plano Professional',
        'Pedidos ilimitados',
        'White label completo',
        'API personalizada',
        'Suporte dedicado',
        'Integração customizada',
        'Relatórios personalizados',
        'Múltiplas lojas',
        'Gerente de conta'
      ],
      limitations: [],
      limits: {
        orders: -1, // Ilimitado
        products: -1,
        categories: -1
      }
    }
  ];

  const calculateSavings = (orders: number) => {
    const ifoodCommission = orders * 15 * 0.15; // 15% de comissão média no iFood
    const uberCommission = orders * 15 * 0.25; // 25% de comissão média no Uber Eats
    const averageCommission = (ifoodCommission + uberCommission) / 2;
    return averageCommission;
  };

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 mb-6">
            💰 Economize até R$ 3.000/mês em comissões
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Planos que{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              Cabem no seu Bolso
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para o seu restaurante. Todos incluem setup profissional 
            e suporte completo. Sem taxas de setup ou fidelidade.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              Mensal
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-sm ${isAnnual ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800">
                Economize 10%
              </Badge>
            )}
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mb-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center justify-center">
                <Calculator className="w-6 h-6" />
                <span>Calculadora de Economia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantos pedidos você faz por mês?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold text-lg w-20 text-center">
                    {monthlyOrders}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm opacity-90">Você paga em comissões</p>
                  <p className="text-2xl font-bold">
                    R$ {calculateSavings(monthlyOrders).toFixed(0)}
                  </p>
                  <p className="text-xs opacity-75">por mês no iFood/Uber</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm opacity-90">Economia anual</p>
                  <p className="text-2xl font-bold">
                    R$ {(calculateSavings(monthlyOrders) * 12).toFixed(0)}
                  </p>
                  <p className="text-xs opacity-75">usando nossa plataforma</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const savings = isAnnual ? plan.monthlyPrice - plan.annualPrice : 0;
            
            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'ring-2 ring-orange-500 scale-105 shadow-xl' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold">
                    🔥 MAIS POPULAR
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-gray-900">
                        R$ {price}
                      </span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                    
                    {isAnnual && savings > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        Economize R$ {savings}/mês
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Cobrança {isAnnual ? 'anual' : 'mensal'} • Cancele quando quiser
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-center space-x-3">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    onClick={scrollToCTA}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    size="lg"
                  >
                    Começar com {plan.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    ✅ 14 dias grátis • ✅ Setup incluído • ✅ Sem fidelidade
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Compare todos os recursos
          </h3>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">Recursos</th>
                    {plans.map(plan => (
                      <th key={plan.name} className="text-center p-4 font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Pedidos por mês</td>
                    {plans.map(plan => (
                      <td key={plan.name} className="text-center p-4">
                        {plan.limits.orders === -1 ? 'Ilimitado' : plan.limits.orders}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">Produtos no cardápio</td>
                    {plans.map(plan => (
                      <td key={plan.name} className="text-center p-4">
                        {plan.limits.products === -1 ? 'Ilimitado' : plan.limits.products}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Categorias</td>
                    {plans.map(plan => (
                      <td key={plan.name} className="text-center p-4">
                        {plan.limits.categories === -1 ? 'Ilimitado' : plan.limits.categories}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas sobre qual plano escolher?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Fale com nossa equipe e receba uma consultoria gratuita personalizada
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={scrollToCTA}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Falar com Consultor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;