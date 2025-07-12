import React from 'react';
import LandingHeader from '../components/LandingHeader';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import LandingFooter from '../components/LandingFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Users,
  Calculator,
  ArrowRight
} from 'lucide-react';

/**
 * Pricing Page Component
 * Dedicated page for pricing information with detailed comparison
 */
const PricingPage: React.FC = () => {
  const competitorComparison = [
    {
      name: 'iFood',
      commission: '15-20%',
      monthlyFee: 'R$ 0',
      setup: 'Grátis',
      support: 'Limitado',
      customization: 'Nenhuma',
      directContact: 'Não',
      color: 'text-red-600'
    },
    {
      name: 'Uber Eats',
      commission: '20-30%',
      monthlyFee: 'R$ 0',
      setup: 'Grátis',
      support: 'Limitado',
      customization: 'Nenhuma',
      directContact: 'Não',
      color: 'text-red-600'
    },
    {
      name: 'Quentinhas',
      commission: '0%',
      monthlyFee: 'A partir de R$ 99',
      setup: 'Grátis',
      support: 'Completo 24/7',
      customization: 'Total',
      directContact: 'WhatsApp direto',
      color: 'text-green-600'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 mb-6">
                💰 Compare e economize milhares por mês
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Preços{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                  Transparentes
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Sem surpresas, sem taxas escondidas. Compare nossos preços com os 
                aplicativos de delivery e veja quanto você pode economizar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center"
                >
                  Ver Planos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => scrollToSection('comparison')}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold"
                >
                  Comparar com Concorrentes
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">0%</div>
                  <div className="text-gray-600">Comissão sobre vendas</div>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">280%</div>
                  <div className="text-gray-600">Aumento médio de vendas</div>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-gray-600">Restaurantes ativos</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section id="comparison" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Compare com os{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  Aplicativos de Delivery
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Veja a diferença real entre pagar comissões abusivas e ter sua própria plataforma
              </p>
            </div>

            <Card className="overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-6 font-semibold text-gray-900">Plataforma</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Comissão</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Taxa Mensal</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Setup</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Suporte</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Personalização</th>
                      <th className="text-center p-6 font-semibold text-gray-900">Contato Direto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {competitorComparison.map((platform, index) => (
                      <tr key={index} className={platform.name === 'Quentinhas' ? 'bg-green-50' : ''}>
                        <td className="p-6">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              platform.name === 'Quentinhas' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-semibold text-gray-900">{platform.name}</span>
                            {platform.name === 'Quentinhas' && (
                              <Badge className="bg-green-100 text-green-800">Recomendado</Badge>
                            )}
                          </div>
                        </td>
                        <td className={`text-center p-6 font-semibold ${platform.color}`}>
                          {platform.commission}
                        </td>
                        <td className="text-center p-6 text-gray-700">
                          {platform.monthlyFee}
                        </td>
                        <td className="text-center p-6 text-gray-700">
                          {platform.setup}
                        </td>
                        <td className="text-center p-6 text-gray-700">
                          {platform.support}
                        </td>
                        <td className="text-center p-6 text-gray-700">
                          {platform.customization}
                        </td>
                        <td className="text-center p-6 text-gray-700">
                          {platform.directContact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Savings Calculator */}
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                      Calcule sua Economia Anual
                    </h3>
                    <p className="text-lg opacity-90">
                      Com 300 pedidos/mês de R$ 15 cada, você economiza:
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white/20 rounded-lg p-6">
                      <div className="text-3xl font-bold mb-2">R$ 13.500</div>
                      <div className="text-sm opacity-90">Comissões iFood (15%)</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-6">
                      <div className="text-3xl font-bold mb-2">R$ 22.500</div>
                      <div className="text-sm opacity-90">Comissões Uber Eats (25%)</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-6">
                      <div className="text-3xl font-bold mb-2">R$ 2.388</div>
                      <div className="text-sm opacity-90">Nosso plano Professional</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-8">
                    <div className="text-4xl font-bold mb-2">
                      Economia: R$ 11.112 - R$ 20.112/ano
                    </div>
                    <p className="opacity-90">
                      Isso é dinheiro que fica no seu bolso, não no dos aplicativos!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
};

export default PricingPage;