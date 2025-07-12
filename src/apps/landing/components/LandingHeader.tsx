import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';

/**
 * Landing Header Component
 * Navigation header for the landing page
 */
const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Quentinhas</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('benefits')}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Auth Buttons & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>(11) 9999-9999</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-orange-500"
            >
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/cadastro')}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Cadastrar
            </Button>
            <Button
              onClick={() => scrollToSection('cta')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-left text-gray-600 hover:text-orange-500 transition-colors"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-600 hover:text-orange-500 transition-colors"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-left text-gray-600 hover:text-orange-500 transition-colors"
              >
                Preços
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-gray-600 hover:text-orange-500 transition-colors"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left text-gray-600 hover:text-orange-500 transition-colors"
              >
                FAQ
              </button>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Phone className="w-4 h-4" />
                  <span>(11) 9999-9999</span>
                </div>
                <div className="space-y-2 mb-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="w-full justify-start text-gray-600 hover:text-orange-500"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/cadastro')}
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    Cadastrar
                  </Button>
                </div>
                <Button
                  onClick={() => scrollToSection('cta')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Começar Agora
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;