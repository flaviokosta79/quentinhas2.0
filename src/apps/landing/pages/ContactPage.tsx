import React, { useState } from 'react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Clock,
  Users,
  Headphones,
  Send,
  CheckCircle,
  ArrowRight,
  Calendar,
  Globe,
  Shield
} from 'lucide-react';

/**
 * Contact Page Component
 * Complete contact information and contact form
 */
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurant: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Resposta em até 5 minutos',
      contact: '(11) 99999-9999',
      action: 'Abrir WhatsApp',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      available: '24/7'
    },
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Atendimento personalizado',
      contact: '(11) 3333-3333',
      action: 'Ligar Agora',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      available: 'Seg-Sex 8h-18h'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Resposta em até 2 horas',
      contact: 'contato@quentinhas.com',
      action: 'Enviar Email',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      available: '24/7'
    },
    {
      icon: Calendar,
      title: 'Agendar Reunião',
      description: 'Consultoria gratuita',
      contact: 'Demonstração ao vivo',
      action: 'Agendar',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      available: 'Seg-Sex 9h-17h'
    }
  ];

  const officeInfo = {
    address: 'Av. Paulista, 1000 - Bela Vista',
    city: 'São Paulo, SP - 01310-100',
    hours: 'Segunda a Sexta: 8h às 18h',
    phone: '(11) 3333-3333',
    email: 'contato@quentinhas.com'
  };

  const supportStats = [
    { icon: Clock, number: '< 5min', label: 'Tempo de resposta médio' },
    { icon: Users, number: '500+', label: 'Clientes atendidos' },
    { icon: Headphones, number: '4.9/5', label: 'Satisfação do suporte' },
    { icon: Shield, number: '24/7', label: 'Disponibilidade' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <LandingHeader />
        <main className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Mensagem Enviada com Sucesso!
                </h2>
                
                <p className="text-lg text-gray-600 mb-6">
                  Obrigado pelo contato, <strong>{formData.name}</strong>! 
                  Recebemos sua mensagem e nossa equipe entrará em contato em até 2 horas.
                </p>
                
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-800 mb-3">
                    O que acontece agora:
                  </h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Nossa equipe analisará sua solicitação</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Entraremos em contato via WhatsApp ou telefone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Agendaremos uma demonstração personalizada</span>
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
                    Enviar Nova Mensagem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 mb-6">
                💬 Estamos aqui para ajudar
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Entre em{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Contato
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Nossa equipe está pronta para esclarecer suas dúvidas, fazer uma 
                demonstração personalizada e ajudar você a transformar seu restaurante.
              </p>
            </div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {supportStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="text-center p-6">
                    <CardContent className="p-0">
                      <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
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

        {/* Contact Methods */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Escolha a Melhor{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                  Forma de Contato
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferecemos múltiplos canais de atendimento para sua conveniência
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`w-8 h-8 ${method.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {method.description}
                      </p>
                      <p className="font-semibold text-gray-900 mb-2">
                        {method.contact}
                      </p>
                      <Badge variant="outline" className="mb-4 text-xs">
                        {method.available}
                      </Badge>
                      <Button
                        className={`w-full ${method.color.replace('text-', 'bg-').replace('-600', '-600')} hover:${method.color.replace('text-', 'bg-').replace('-600', '-700')} text-white`}
                      >
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Info */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Envie sua Mensagem
                    </CardTitle>
                    <p className="text-gray-600">
                      Preencha o formulário e nossa equipe entrará em contato em até 2 horas
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seu Nome *
                          </label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="João Silva"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="joao@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            WhatsApp *
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Restaurante
                          </label>
                          <Input
                            type="text"
                            name="restaurant"
                            placeholder="Quentinhas do João"
                            value={formData.restaurant}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assunto *
                        </label>
                        <Input
                          type="text"
                          name="subject"
                          placeholder="Quero conhecer a plataforma"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem *
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Conte-nos mais sobre seu restaurante e como podemos ajudar..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar Mensagem
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        ✅ Resposta garantida em até 2 horas • ✅ Seus dados estão seguros
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Office Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                      Nosso Escritório
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{officeInfo.address}</p>
                        <p className="text-gray-600">{officeInfo.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-700">{officeInfo.hours}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-700">{officeInfo.phone}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-700">{officeInfo.email}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      Prefere uma Demonstração ao Vivo?
                    </h3>
                    <p className="mb-6 opacity-90">
                      Agende uma reunião gratuita e veja como nossa plataforma 
                      pode transformar seu restaurante em 30 minutos.
                    </p>
                    <Button
                      className="bg-white text-green-600 hover:bg-gray-100 w-full"
                    >
                      Agendar Demonstração
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Outras Formas de Contato
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">www.quentinhas.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Chat online no site</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Redes sociais @quentinhas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ContactPage;