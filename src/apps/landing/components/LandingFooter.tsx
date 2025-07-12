import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
  Shield,
  Award,
  Clock,
  Users,
  ExternalLink
} from 'lucide-react';

/**
 * Landing Footer Component
 * Complete footer with links, contact info, and company information
 */
const LandingFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    platform: [
      { label: 'Como Funciona', action: () => scrollToSection('how-it-works') },
      { label: 'Benefícios', action: () => scrollToSection('benefits') },
      { label: 'Preços', action: () => scrollToSection('pricing') },
      { label: 'Depoimentos', action: () => scrollToSection('testimonials') },
      { label: 'FAQ', action: () => scrollToSection('faq') }
    ],
    company: [
      { label: 'Sobre Nós', href: '/sobre' },
      { label: 'Nossa História', href: '/historia' },
      { label: 'Equipe', href: '/equipe' },
      { label: 'Carreiras', href: '/carreiras' },
      { label: 'Imprensa', href: '/imprensa' }
    ],
    support: [
      { label: 'Central de Ajuda', href: '/ajuda' },
      { label: 'Documentação', href: '/docs' },
      { label: 'Status do Sistema', href: '/status' },
      { label: 'Contato', href: '/contato' },
      { label: 'Suporte Técnico', href: '/suporte' }
    ],
    legal: [
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'LGPD', href: '/lgpd' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/quentinhas', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/quentinhas', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/quentinhas', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/quentinhas', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/quentinhas', label: 'YouTube' }
  ];

  const certifications = [
    { icon: Shield, label: 'LGPD Compliant' },
    { icon: Award, label: 'ISO 27001' },
    { icon: Clock, label: 'Uptime 99.9%' },
    { icon: Users, label: '500+ Clientes' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Quentinhas</h3>
              <p className="text-gray-400 mb-4">
                A plataforma completa para restaurantes que vendem quentinhas. 
                Crie sua loja online, receba pedidos pelo WhatsApp e pare de pagar 
                comissões abusivas para aplicativos de delivery.
              </p>
              <Badge className="bg-green-600 text-white hover:bg-green-700">
                🚀 Mais de 500 restaurantes ativos
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">
                  Av. Paulista, 1000 - São Paulo, SP
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">contato@quentinhas.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Suporte 24/7 via WhatsApp</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Siga-nos nas redes sociais:</p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Plataforma</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Suporte</h4>
            <ul className="space-y-2 mb-6">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Quick CTA */}
            <Card className="bg-green-600 border-0">
              <CardContent className="p-4">
                <h5 className="font-semibold text-white mb-2">
                  Precisa de Ajuda?
                </h5>
                <p className="text-green-100 text-sm mb-3">
                  Nossa equipe está pronta para ajudar
                </p>
                <Button
                  size="sm"
                  className="bg-white text-green-600 hover:bg-gray-100 w-full"
                >
                  Falar Conosco
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">{cert.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Quentinhas. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                CNPJ: 00.000.000/0001-00 | Razão Social: Quentinhas Tecnologia Ltda.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Voltar ao Topo
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs text-gray-500">
            <span className="flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              SSL Certificado
            </span>
            <span className="flex items-center">
              <Award className="w-3 h-3 mr-1" />
              PCI DSS Compliant
            </span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Uptime 99.9%
            </span>
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Suporte 24/7
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;