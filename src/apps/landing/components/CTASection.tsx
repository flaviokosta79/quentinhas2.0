import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Shield, 
  Star,
  Zap,
  Gift,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

/**
 * CTA Section Component
 * Final call-to-action with registration form and urgency elements
 */
const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const benefits = [
    '14 dias grátis para testar',
    'Setup profissional incluído',
    'Suporte técnico completo',
    'Sem taxa de setup',
    'Cancele quando quiser'
  ];

  const urgencyStats = [
    {
      icon: Users,
      number: '500+',
      label: 'Restaurantes já cadastrados',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      number: '280%',
      label: 'Aumento médio de vendas',
      color: 'text-green-600'
    },
    {
      icon: DollarSign,
      number: 'R$ 2.8M',
      label: 'Economizado em comissões',
      color: 'text-orange-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section id="cta" className="py-20 bg-gradient-to-r from-green-500 to-emerald-500">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Cadastro Realizado com Sucesso!
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Obrigado, <strong>{name}</strong>! Recebemos seu cadastro e nossa equipe 
                entrará em contato em até 2 horas para configurar sua loja online.
              </p>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-green-800 mb-3">
                  Próximos passos:
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Nossa equipe entrará em contato via WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Configuraremos sua loja em até 24 horas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Você receberá acesso ao painel administrativo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Começará a vender online imediatamente</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Cadastrar Outro Restaurante
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-green-500 to-emerald-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        
        {/* Urgency Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {urgencyStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-3 text-white" />
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="text-white">
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 mb-6">
              🚀 Oferta por tempo limitado
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Pare de Pagar{' '}
              <span className="text-yellow-300">
                Comissões Abusivas
              </span>
              <br />
              Comece Hoje Mesmo!
            </h2>
            
            <p className="text-xl mb-8 opacity-90">
              Junte-se a mais de 500 restaurantes que já triplicaram suas vendas 
              e economizaram milhares em comissões. Sua loja online fica pronta em 24 horas!
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Urgency Elements */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Últimas 48 horas</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium">Setup grátis</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`/api/placeholder/40/40`}
                    alt={`Cliente ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
                <p className="text-sm opacity-90">
                  +500 restaurantes confiam em nós
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <Card className="shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Comece Seu Teste Grátis
                  </h3>
                  <p className="text-gray-600">
                    Preencha os dados e nossa equipe entrará em contato em até 2 horas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Restaurante *
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: Quentinhas da Maria"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seu Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-14 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        Começar Teste Grátis Agora
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      ✅ 14 dias grátis • ✅ Sem cartão de crédito • ✅ Cancele quando quiser
                    </p>
                  </div>
                </form>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 mt-6 pt-6 border-t border-gray-200">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">
                    Seus dados estão seguros e protegidos
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <div className="mt-6 text-center">
              <p className="text-white mb-4 opacity-90">
                Prefere falar conosco diretamente?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Telefone
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;