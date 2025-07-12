import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Settings, 
  Rocket, 
  ArrowRight,
  CheckCircle,
  Clock,
  Smartphone,
  BarChart3,
  MessageCircle,
  DollarSign
} from 'lucide-react';

/**
 * How It Works Section Component
 * Explains the 3-step process to get started
 */
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Cadastre-se Gratuitamente',
      description: 'Preencha um formulário simples com os dados do seu restaurante. Leva apenas 2 minutos.',
      details: [
        'Nome do restaurante',
        'Dados de contato',
        'Endereço de entrega',
        'Horário de funcionamento'
      ],
      time: '2 minutos',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      number: 2,
      icon: Settings,
      title: 'Nossa Equipe Configura Tudo',
      description: 'Em até 24 horas, sua loja online estará pronta com cardápio, preços e integração WhatsApp.',
      details: [
        'Criação da loja online',
        'Upload do cardápio',
        'Configuração de preços',
        'Integração WhatsApp',
        'Testes de funcionamento'
      ],
      time: '24 horas',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      number: 3,
      icon: Rocket,
      title: 'Comece a Vender Online',
      description: 'Sua loja está no ar! Compartilhe o link com clientes e comece a receber pedidos imediatamente.',
      details: [
        'Link da loja personalizado',
        'Pedidos via WhatsApp',
        'Dashboard de gestão',
        'Relatórios de vendas',
        'Suporte contínuo'
      ],
      time: 'Imediato',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Loja Mobile-First',
      description: 'Otimizada para celular, onde seus clientes fazem pedidos'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Integrado',
      description: 'Receba e gerencie pedidos direto no WhatsApp'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Acompanhe vendas e pedidos em tempo real'
    },
    {
      icon: DollarSign,
      title: 'Pagamentos Seguros',
      description: 'PIX, cartão e dinheiro - receba na hora'
    }
  ];

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 mb-6">
            Processo Simples e Rápido
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Como Funciona em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              3 Passos Simples
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Do cadastro à primeira venda em menos de 24 horas. 
            Nossa equipe cuida de tudo para você focar no que faz de melhor: cozinhar!
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 mb-20">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 1;
            
            return (
              <div key={step.number} className={`flex items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <Card className={`${step.borderColor} border-2 ${step.bgColor} hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        
                        {/* Step Number & Icon */}
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4`}>
                            {step.number}
                          </div>
                          <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center border-2 ${step.borderColor}`}>
                            <IconComponent className={`w-6 h-6 ${step.color.includes('blue') ? 'text-blue-600' : step.color.includes('orange') ? 'text-orange-600' : 'text-green-600'}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {step.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.time}
                            </Badge>
                          </div>
                          
                          <p className="text-lg text-gray-600 mb-6">
                            {step.description}
                          </p>

                          {/* Details List */}
                          <div className="grid md:grid-cols-2 gap-2">
                            {step.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Arrow (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center w-24">
                    <div className={`w-12 h-12 bg-gradient-to-r ${steps[index + 1].color} rounded-full flex items-center justify-center`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            O que você recebe:
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para Começar?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Cadastre-se agora e tenha sua loja online funcionando em 24 horas
              </p>
              <Button
                onClick={scrollToCTA}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8"
              >
                Criar Minha Loja Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm mt-4 opacity-75">
                ✅ Teste grátis por 14 dias • ✅ Setup profissional incluído • ✅ Suporte 24/7
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;