import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  CreditCard,
  Smartphone,
  Settings,
  Users
} from 'lucide-react';

/**
 * FAQ Section Component
 * Shows frequently asked questions with expandable answers
 */
const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqCategories = [
    {
      title: 'Primeiros Passos',
      icon: Settings,
      color: 'text-blue-600',
      faqs: [
        {
          question: 'Como funciona o processo de criação da minha loja online?',
          answer: 'É muito simples! Após se cadastrar, nossa equipe técnica cria sua loja personalizada em até 24 horas. Você recebe acesso ao painel administrativo, onde pode adicionar seus produtos, configurar preços e personalizar as cores da sua marca. Também configuramos a integração com WhatsApp para você receber os pedidos automaticamente.'
        },
        {
          question: 'Preciso ter conhecimento técnico para usar a plataforma?',
          answer: 'Não! Nossa plataforma foi desenvolvida para ser extremamente fácil de usar. O painel administrativo é intuitivo, similar ao WhatsApp que você já conhece. Além disso, oferecemos treinamento completo e suporte técnico sempre que precisar. Você vai conseguir gerenciar tudo sozinho em poucos minutos.'
        },
        {
          question: 'Quanto tempo leva para minha loja ficar no ar?',
          answer: 'Sua loja fica pronta em até 24 horas após o cadastro! Nosso processo é automatizado: você se cadastra, envia as informações do seu restaurante (nome, logo, cardápio), e nossa equipe configura tudo. No dia seguinte, você já está vendendo online com sua própria plataforma.'
        }
      ]
    },
    {
      title: 'Pagamentos e Preços',
      icon: CreditCard,
      color: 'text-green-600',
      faqs: [
        {
          question: 'Quais são as taxas cobradas? Existe taxa por transação?',
          answer: 'Cobramos apenas a mensalidade do plano escolhido. NÃO cobramos nenhuma taxa por transação ou comissão sobre vendas. Todo o dinheiro das vendas vai direto para sua conta. Isso é muito diferente dos aplicativos de delivery que cobram 15% a 30% de comissão em cada pedido.'
        },
        {
          question: 'Como recebo o pagamento dos meus clientes?',
          answer: 'Os pagamentos vão direto para sua conta! Integramos com os principais meios de pagamento (PIX, cartão de crédito/débito). Quando o cliente paga, o dinheiro cai na sua conta em até 1 dia útil para PIX e até 30 dias para cartão. Você tem controle total sobre seus recebimentos.'
        },
        {
          question: 'Posso cancelar minha assinatura a qualquer momento?',
          answer: 'Sim! Não temos fidelidade. Você pode cancelar sua assinatura a qualquer momento através do painel administrativo ou entrando em contato conosco. Não cobramos multa ou taxa de cancelamento. Acreditamos que você deve ficar porque está satisfeito, não por obrigação.'
        }
      ]
    },
    {
      title: 'Funcionalidades',
      icon: Smartphone,
      color: 'text-purple-600',
      faqs: [
        {
          question: 'Como funciona a integração com WhatsApp?',
          answer: 'É automática! Quando um cliente faz um pedido na sua loja online, você recebe uma mensagem no seu WhatsApp com todos os detalhes: itens pedidos, endereço de entrega, forma de pagamento e contato do cliente. Você pode responder diretamente pelo WhatsApp para confirmar o pedido e manter contato direto com o cliente.'
        },
        {
          question: 'Posso personalizar as cores e design da minha loja?',
          answer: 'Sim! Você pode personalizar as cores da sua loja para combinar com a identidade visual da sua marca. Pode adicionar seu logo, escolher as cores principais, e personalizar textos. Nos planos Professional e Enterprise, oferecemos ainda mais opções de personalização.'
        },
        {
          question: 'A loja funciona bem no celular dos meus clientes?',
          answer: 'Perfeitamente! Todas as nossas lojas são responsivas, ou seja, se adaptam automaticamente ao celular, tablet ou computador. Como a maioria dos pedidos vem pelo celular, priorizamos uma experiência mobile perfeita. Seus clientes vão conseguir fazer pedidos facilmente de qualquer dispositivo.'
        }
      ]
    },
    {
      title: 'Suporte e Segurança',
      icon: Shield,
      color: 'text-orange-600',
      faqs: [
        {
          question: 'Que tipo de suporte vocês oferecem?',
          answer: 'Oferecemos suporte completo! Temos chat online, WhatsApp, email e telefone. No plano Starter, o suporte é por email. No Professional, você tem suporte prioritário. No Enterprise, você tem um gerente de conta dedicado. Nosso time responde rapidamente e está sempre pronto para ajudar.'
        },
        {
          question: 'Meus dados e dos meus clientes estão seguros?',
          answer: 'Absolutamente! Usamos criptografia de ponta e seguimos todas as normas de segurança. Seus dados ficam em servidores seguros no Brasil. Somos certificados pela LGPD e nunca compartilhamos informações com terceiros. A segurança dos seus dados é nossa prioridade máxima.'
        },
        {
          question: 'E se eu tiver problemas técnicos?',
          answer: 'Nosso suporte técnico resolve rapidamente! Temos uma equipe especializada que monitora a plataforma 24/7. Se houver qualquer problema, somos notificados automaticamente e já começamos a resolver. Você também pode nos contatar a qualquer momento e priorizamos a solução de problemas técnicos.'
        }
      ]
    }
  ];

  const allFAQs = faqCategories.flatMap((category, categoryIndex) =>
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      id: categoryIndex * 100 + faqIndex,
      category: category.title,
      categoryIcon: category.icon,
      categoryColor: category.color
    }))
  );

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 mb-6">
            ❓ Tire todas suas dúvidas
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Perguntas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Frequentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossa plataforma. 
            Não encontrou o que procura? Entre em contato conosco!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
                <div className="space-y-2">
                  {faqCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={index}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        onClick={() => {
                          const firstFAQId = index * 100;
                          setOpenFAQ(firstFAQId);
                          document.getElementById(`faq-${firstFAQId}`)?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                          });
                        }}
                      >
                        <IconComponent className={`w-5 h-5 ${category.color}`} />
                        <span className="text-sm font-medium text-gray-700">
                          {category.title}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {category.faqs.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Contact Card */}
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                  <h4 className="font-semibold mb-2">Ainda tem dúvidas?</h4>
                  <p className="text-sm mb-3 opacity-90">
                    Nossa equipe está pronta para ajudar!
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>suporte@quentinhas.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {allFAQs.map((faq) => {
                const CategoryIcon = faq.categoryIcon;
                const isOpen = openFAQ === faq.id;
                
                return (
                  <Card 
                    key={faq.id}
                    id={`faq-${faq.id}`}
                    className={`transition-all duration-200 ${
                      isOpen ? 'shadow-lg ring-2 ring-blue-500/20' : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-4 flex-1">
                          <CategoryIcon className={`w-5 h-5 ${faq.categoryColor} mt-1 flex-shrink-0`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {faq.question}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-4">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="pl-9 border-l-2 border-gray-200 ml-2">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <Card className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">
                  Não encontrou sua resposta?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Nossa equipe de suporte está disponível para esclarecer qualquer dúvida
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={scrollToCTA}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Começar Teste Grátis
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    Falar com Suporte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24h</div>
            <div className="text-sm text-gray-600">Tempo de resposta</div>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Clientes atendidos</div>
          </div>
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.9/5</div>
            <div className="text-sm text-gray-600">Satisfação suporte</div>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Dados seguros</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;