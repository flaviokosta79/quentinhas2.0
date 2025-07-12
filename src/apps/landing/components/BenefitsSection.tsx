import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Smartphone, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Shield, 
  Headphones,
  Zap,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  Heart
} from 'lucide-react';

/**
 * Benefits Section Component
 * Highlights the main benefits of using the platform
 */
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Zero Comissões',
      description: 'Diferente do iFood e Uber Eats, você não paga comissão por pedido. Todo o dinheiro fica com você.',
      highlight: 'Economia de até R$ 2.000/mês',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Smartphone,
      title: 'Loja Online Profissional',
      description: 'Seu próprio site com domínio personalizado. Seus clientes fazem pedidos direto com você.',
      highlight: 'Exemplo: pizzariadojose.quentinhas.com',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Integrado',
      description: 'Receba pedidos direto no seu WhatsApp. Seus clientes podem tirar dúvidas e acompanhar entregas.',
      highlight: 'Comunicação direta com clientes',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      title: 'Setup em 24 Horas',
      description: 'Nossa equipe configura tudo para você. Em 24h sua loja está online recebendo pedidos.',
      highlight: 'Suporte completo incluído',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: TrendingUp,
      title: 'Aumento de 300% nas Vendas',
      description: 'Nossos clientes relatam aumento médio de 300% nas vendas após usar nossa plataforma.',
      highlight: 'Resultados comprovados',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Acompanhe vendas, pedidos e clientes em tempo real. Relatórios detalhados para tomar decisões.',
      highlight: 'Gestão profissional',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Settings,
      title: 'Personalização Total',
      description: 'Cores, logo, cardápio, preços. Tudo personalizado com a identidade do seu restaurante.',
      highlight: 'Sua marca em destaque',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: Shield,
      title: 'Pagamentos Seguros',
      description: 'PIX, cartão de crédito e débito. Receba na hora com total segurança e sem burocracia.',
      highlight: 'Certificação SSL',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Headphones,
      title: 'Suporte 24/7',
      description: 'Nossa equipe está sempre disponível para ajudar. WhatsApp, telefone e chat online.',
      highlight: 'Nunca fique na mão',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  const problems = [
    {
      problem: 'Pagando 15-30% de comissão para apps de delivery',
      solution: 'Zero comissões - todo lucro fica com você'
    },
    {
      problem: 'Dependendo de plataformas de terceiros',
      solution: 'Sua própria loja online independente'
    },
    {
      problem: 'Sem contato direto com clientes',
      solution: 'WhatsApp integrado para comunicação direta'
    },
    {
      problem: 'Dificuldade para gerenciar pedidos',
      solution: 'Dashboard profissional e intuitivo'
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Pare de Perder Dinheiro com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Comissões
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como centenas de restaurantes estão aumentando suas vendas 
            e reduzindo custos com nossa plataforma
          </p>
        </div>

        {/* Problems vs Solutions */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-600 mb-6 text-center">
                ❌ Problemas Atuais
              </h3>
              {problems.map((item, index) => (
                <Card key={index} className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <p className="text-gray-700 font-medium">{item.problem}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600 mb-6 text-center">
                ✅ Nossa Solução
              </h3>
              {problems.map((item, index) => (
                <Card key={index} className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <p className="text-gray-700 font-medium">{item.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${benefit.bgColor} ${benefit.color}`}>
                    {benefit.highlight}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para Aumentar suas Vendas?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Junte-se a mais de 500 restaurantes que já estão vendendo mais e pagando menos
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Mais de 10.000 pedidos processados</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>500+ restaurantes ativos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Setup em 24 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;