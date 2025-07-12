import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Play,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

/**
 * Hero Section Component
 * Main hero section with compelling headline and signup form
 */
const HeroSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Scroll to CTA section for full registration
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2">
              🚀 Mais de 500 restaurantes já usam nossa plataforma
            </Badge>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Seu Restaurante de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Quentinhas
                </span>{' '}
                Online em{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  24 Horas
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Crie sua loja online profissional, receba pedidos pelo WhatsApp e 
                aumente suas vendas em <strong>até 300%</strong> sem pagar comissões 
                para terceiros.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Sem comissões</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Setup em 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">WhatsApp integrado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Suporte 24/7</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Comece gratuitamente - Digite seu email:
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8"
                    >
                      {isSubmitting ? 'Enviando...' : 'Começar Agora'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  ✅ Teste grátis por 14 dias • ✅ Sem cartão de crédito • ✅ Cancele quando quiser
                </p>
              </form>
            </Card>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">4.9/5</span>
                <span>(127 avaliações)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span>+500 restaurantes</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Demo Image/Video */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Veja como funciona</p>
                    <p className="text-sm text-gray-600">Demo de 2 minutos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">+300%</p>
                  <p className="text-xs text-gray-600">Aumento médio</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">24h</p>
                  <p className="text-xs text-gray-600">Para começar</p>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">0%</p>
                  <p className="text-xs text-gray-600">Comissão</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Junte-se a centenas de restaurantes que já aumentaram suas vendas
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-sm text-gray-500">Pizzaria do João</div>
            <div className="text-sm text-gray-500">Lanchonete da Ana</div>
            <div className="text-sm text-gray-500">Restaurante Italiano</div>
            <div className="text-sm text-gray-500">Quentinhas Express</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;