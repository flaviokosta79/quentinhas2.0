import React from 'react';
import LandingHeader from '../components/LandingHeader';
import CTASection from '../components/CTASection';
import LandingFooter from '../components/LandingFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Heart, 
  Users, 
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Lightbulb,
  Shield,
  Handshake,
  ArrowRight,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';

/**
 * About Page Component
 * Company information, mission, values, and team
 */
const AboutPage: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Restaurantes Ativos', icon: Users },
    { number: '280%', label: 'Aumento Médio de Vendas', icon: TrendingUp },
    { number: 'R$ 2.8M', label: 'Economizado em Comissões', icon: Award },
    { number: '4.9/5', label: 'Satisfação dos Clientes', icon: Star }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Paixão pelo Negócio Local',
      description: 'Acreditamos que cada restaurante tem uma história única e merece prosperar sem depender de grandes corporações.',
      color: 'text-red-500'
    },
    {
      icon: Shield,
      title: 'Transparência Total',
      description: 'Sem taxas escondidas, sem surpresas. Nossos preços são claros e nossos resultados são comprovados.',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Inovação Constante',
      description: 'Desenvolvemos tecnologia de ponta para simplificar a vida dos restaurantes e melhorar a experiência dos clientes.',
      color: 'text-yellow-500'
    },
    {
      icon: Handshake,
      title: 'Parceria Verdadeira',
      description: 'Não somos apenas um fornecedor, somos parceiros no seu sucesso. Seu crescimento é o nosso crescimento.',
      color: 'text-green-500'
    }
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Fundação da Quentinhas',
      description: 'Nascemos da frustração de ver restaurantes pagando comissões abusivas para aplicativos de delivery.',
      icon: Lightbulb
    },
    {
      year: '2023',
      title: 'Primeiros Clientes',
      description: 'Lançamos nossa plataforma com 10 restaurantes piloto que triplicaram suas vendas em 3 meses.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Expansão Nacional',
      description: 'Chegamos a 500+ restaurantes ativos em todo o Brasil, economizando milhões em comissões.',
      icon: MapPin
    },
    {
      year: '2024',
      title: 'Reconhecimento',
      description: 'Fomos reconhecidos como a melhor plataforma para restaurantes de quentinhas do Brasil.',
      icon: Award
    }
  ];

  const team = [
    {
      name: 'Carlos Silva',
      role: 'CEO & Fundador',
      description: 'Ex-dono de restaurante que viveu na pele os problemas dos aplicativos de delivery.',
      avatar: '/api/placeholder/120/120',
      linkedin: '#'
    },
    {
      name: 'Ana Santos',
      role: 'CTO',
      description: 'Especialista em tecnologia com 15 anos de experiência em plataformas digitais.',
      avatar: '/api/placeholder/120/120',
      linkedin: '#'
    },
    {
      name: 'João Costa',
      role: 'Head de Produto',
      description: 'Designer de experiência focado em criar soluções simples para problemas complexos.',
      avatar: '/api/placeholder/120/120',
      linkedin: '#'
    },
    {
      name: 'Maria Oliveira',
      role: 'Head de Sucesso do Cliente',
      description: 'Garante que cada restaurante alcance seus objetivos de crescimento e lucratividade.',
      avatar: '/api/placeholder/120/120',
      linkedin: '#'
    }
  ];

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 mb-6">
                🚀 Nossa missão é libertar restaurantes das comissões abusivas
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Sobre a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                  Quentinhas
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Somos uma empresa brasileira criada por empreendedores que viveram na pele 
                os problemas dos aplicativos de delivery. Nossa missão é dar independência 
                e lucratividade de volta aos restaurantes.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <IconComponent className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-6">
                  🎯 Nossa Missão
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Devolver o Controle aos{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    Restaurantes
                  </span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Vimos restaurantes incríveis fechando as portas porque não conseguiam 
                  mais pagar as comissões abusivas dos aplicativos de delivery. Vimos 
                  empreendedores trabalhando 12 horas por dia para enriquecer grandes 
                  corporações.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Por isso criamos a Quentinhas: para que cada restaurante tenha sua 
                  própria plataforma digital, mantenha contato direto com seus clientes 
                  e fique com 100% do lucro das suas vendas.
                </p>
                <Button
                  onClick={scrollToCTA}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Fazer Parte da Mudança
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="relative">
                <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CardContent className="p-0">
                    <Target className="w-12 h-12 mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                    <p className="text-lg opacity-90 mb-6">
                      Ser a principal plataforma de vendas online para restaurantes 
                      brasileiros, oferecendo independência, lucratividade e crescimento 
                      sustentável.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>Zero dependência de terceiros</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>100% do lucro para o restaurante</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>Relacionamento direto com clientes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nossos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Valores
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Os princípios que guiam cada decisão que tomamos e cada produto que desenvolvemos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <IconComponent className={`w-12 h-12 ${value.color} mb-6`} />
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Nossa{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                  Jornada
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                De uma ideia nascida da frustração até uma plataforma que transforma negócios
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start space-x-6 mb-12 last:mb-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge className="bg-green-100 text-green-800">
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Conheça Nosso{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Time
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Profissionais apaixonados por tecnologia e pelo sucesso dos restaurantes brasileiros
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {member.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      LinkedIn
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutPage;