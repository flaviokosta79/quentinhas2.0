import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Play,
  MapPin,
  Calendar
} from 'lucide-react';

/**
 * Testimonials Section Component
 * Shows customer success stories and reviews
 */
const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      restaurant: 'Quentinhas da Maria',
      location: 'São Paulo, SP',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      joinDate: 'Março 2024',
      results: {
        salesIncrease: '280%',
        monthlyOrders: '450',
        savedCommissions: 'R$ 2.800'
      },
      quote: 'Em apenas 3 meses, minhas vendas triplicaram! Antes eu dependia totalmente do iFood e pagava uma fortuna em comissões. Agora tenho minha própria plataforma e meus clientes pedem direto comigo pelo WhatsApp. O melhor investimento que já fiz!',
      videoUrl: '/testimonials/maria-silva.mp4',
      featured: true
    },
    {
      id: 2,
      name: 'João Santos',
      restaurant: 'Sabor Caseiro',
      location: 'Rio de Janeiro, RJ',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      joinDate: 'Janeiro 2024',
      results: {
        salesIncrease: '320%',
        monthlyOrders: '680',
        savedCommissions: 'R$ 4.200'
      },
      quote: 'Estava gastando mais de R$ 4.000 por mês só em comissões do delivery. Agora esse dinheiro fica comigo! A plataforma é muito fácil de usar e meus clientes adoraram poder pedir direto pelo WhatsApp.',
      videoUrl: '/testimonials/joao-santos.mp4',
      featured: true
    },
    {
      id: 3,
      name: 'Ana Costa',
      restaurant: 'Quentinha Gourmet',
      location: 'Belo Horizonte, MG',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      joinDate: 'Fevereiro 2024',
      results: {
        salesIncrease: '250%',
        monthlyOrders: '320',
        savedCommissions: 'R$ 1.900'
      },
      quote: 'O que mais me impressionou foi a rapidez para colocar no ar. Em 24 horas já estava vendendo! O suporte é excepcional e sempre me ajudam quando preciso. Recomendo para todos os colegas.',
      videoUrl: '/testimonials/ana-costa.mp4',
      featured: false
    },
    {
      id: 4,
      name: 'Carlos Oliveira',
      restaurant: 'Tempero Mineiro',
      location: 'Uberlândia, MG',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      joinDate: 'Abril 2024',
      results: {
        salesIncrease: '190%',
        monthlyOrders: '280',
        savedCommissions: 'R$ 1.500'
      },
      quote: 'Finalmente tenho controle total sobre meu negócio! Posso conversar direto com meus clientes, fazer promoções quando quero e não dependo mais de algoritmos de aplicativo. Liberdade total!',
      videoUrl: '/testimonials/carlos-oliveira.mp4',
      featured: false
    },
    {
      id: 5,
      name: 'Fernanda Lima',
      restaurant: 'Delícias da Vovó',
      location: 'Curitiba, PR',
      avatar: '/api/placeholder/80/80',
      rating: 5,
      joinDate: 'Maio 2024',
      results: {
        salesIncrease: '340%',
        monthlyOrders: '520',
        savedCommissions: 'R$ 3.100'
      },
      quote: 'Meu faturamento quadruplicou! Antes eu mal conseguia pagar as contas, agora estou expandindo para uma cozinha maior. A diferença é que agora eu trabalho para mim, não para os aplicativos.',
      videoUrl: '/testimonials/fernanda-lima.mp4',
      featured: true
    }
  ];

  const stats = [
    {
      number: '500+',
      label: 'Restaurantes Ativos',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      number: '280%',
      label: 'Aumento Médio de Vendas',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      number: 'R$ 2.8M',
      label: 'Economizado em Comissões',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      number: '4.9/5',
      label: 'Avaliação dos Clientes',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 mb-6">
            ⭐ +500 restaurantes já transformaram seus negócios
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Histórias de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              Sucesso Reais
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como outros donos de restaurantes triplicaram suas vendas e 
            economizaram milhares em comissões usando nossa plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
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

        {/* Featured Testimonial */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                
                {/* Video/Image Side */}
                <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 lg:p-12 text-white">
                  <div className="absolute top-6 left-6">
                    <Quote className="w-12 h-12 opacity-30" />
                  </div>
                  
                  {/* Video Placeholder */}
                  <div className="relative bg-black/20 rounded-xl p-8 mb-6 min-h-[200px] flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Ver Depoimento
                    </Button>
                  </div>

                  {/* Results Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">
                        {currentData.results.salesIncrease}
                      </div>
                      <div className="text-xs opacity-90">
                        Aumento vendas
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">
                        {currentData.results.monthlyOrders}
                      </div>
                      <div className="text-xs opacity-90">
                        Pedidos/mês
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">
                        {currentData.results.savedCommissions}
                      </div>
                      <div className="text-xs opacity-90">
                        Economizados
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12">
                  {/* Navigation */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentTestimonial 
                              ? 'bg-green-500' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevTestimonial}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextTestimonial}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(currentData.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "{currentData.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={currentData.avatar}
                      alt={currentData.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {currentData.name}
                      </div>
                      <div className="text-green-600 font-medium">
                        {currentData.restaurant}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {currentData.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Cliente desde {currentData.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Other Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials
            .filter((_, index) => index !== currentTestimonial)
            .slice(0, 3)
            .map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setCurrentTestimonial(testimonials.findIndex(t => t.id === testimonial.id))}
              >
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    "{testimonial.quote}"
                  </p>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-green-50 rounded p-2 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {testimonial.results.salesIncrease}
                      </div>
                      <div className="text-xs text-gray-600">
                        Vendas
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded p-2 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {testimonial.results.savedCommissions}
                      </div>
                      <div className="text-xs text-gray-600">
                        Economizados
                      </div>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-green-600 text-sm">
                        {testimonial.restaurant}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para ser o próximo caso de sucesso?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Junte-se a mais de 500 restaurantes que já transformaram seus negócios
              </p>
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                Começar Minha Transformação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;