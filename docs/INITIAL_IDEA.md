Nome do Projeto: quentinhas.net
Visão Geral do Projeto:
Desenvolver um micro SaaS web, com design mobile-first, chamado quentinhas.com. A plataforma será um cardápio digital interativo e sistema de gestão de pedidos, inspirada visualmente e funcionalmente na simplicidade e eficiência do iFood. O foco é atender a restaurantes que vendem "quentinhas", permitindo que os clientes montem seus pratos de forma personalizada. O sistema deve cobrir todo o ciclo do pedido: da escolha dos itens pelo cliente à confirmação de entrega pelo entregador, com monitoramento em tempo real e automações via IA e WhatsApp.

Público-Alvo:
Primário: Pequenos e médios restaurantes, cozinhas e fornecedores de "quentinhas" que necessitam de um sistema de delivery próprio, moderno e eficiente.
Secundário: Clientes que buscam uma forma rápida e personalizada de pedir suas refeições diárias.
Interfaces e Funcionalidades Principais
A aplicação será dividida em três interfaces web responsivas, garantindo total funcionalidade em desktops e dispositivos móveis.

1. Interface do Cliente (Web - Mobile-First)
Objetivo: Oferecer uma experiência de pedido rápida, visualmente agradável e sem atritos.
Design e UI (Inspirado no iFood):
Página Inicial: Deve apresentar a identidade visual do restaurante (logo, banner), informações de contato, horário de funcionamento e, de forma proeminente, as opções de quentinhas.
Montagem da Quentinha:
Exibir os tamanhos e preços disponíveis (Ex: "Quentinha P - R15,00", "Quentinha M − R18,00", "Quentinha G − R 20,00").
Apresentar as opções de montagem divididas por categorias (Ex: "Base", "Proteína", "Acompanhamentos", "Salada").
Cada item deve ter foto, nome e descrição.
O sistema deve permitir que o dono do restaurante defina a quantidade máxima de escolhas por categoria (Ex: "Escolha 1 base", "Escolha 2 acompanhamentos").
Carrinho de Compras: Visualização clara do resumo do pedido, valor total (produtos + taxa de entrega), campo para observações e opções de edição.
Checkout Simplificado: Processo de finalização em uma única tela, solicitando apenas informações essenciais (nome, WhatsApp, endereço de entrega).
Funcionalidades Essenciais:
Sem Login Obrigatório: O cliente pode fazer o pedido informando apenas os dados necessários para a entrega e contato. (Oferecer login social opcional para salvar endereços e histórico).
Geolocalização: O cliente informa o CEP/endereço para que o sistema calcule a taxa de entrega definida pelo restaurante.
Página de Acompanhamento: Após finalizar o pedido, o cliente recebe um link para uma página de status que exibe em tempo real as etapas: "Pedido recebido", "Em preparação", "Saiu para entrega".
Mapa Interativo: Na etapa "Saiu para entrega", a página de status exibirá um mapa mostrando a localização do entregador em tempo real e a estimativa de chegada (ETA).
Notificações (Via WhatsApp/SMS): Alertas automáticos sobre as principais atualizações de status do pedido.

2. Dashboard do Dono do Restaurante (Web - Responsivo)
Objetivo: Centralizar a gestão de pedidos, cardápio e entregas de forma eficiente e intuitiva.
Design e UI:
Painel de controle (Kanban) como tela principal para uma visão clara do fluxo de produção.
Uso intensivo de notificações visuais (cores, alertas) e sonoras para novos pedidos.
Funcionalidades Essenciais:
Gestão de Pedidos (Painel Kanban):
Colunas de status: "Novos", "Em Preparo", "Aguardando Entrega", "Em Rota", "Concluídos".
Cards de pedidos "arrastáveis" entre as colunas.
Ações rápidas em cada card: Aceitar, Recusar, Imprimir, e atribuir a um entregador.
Gestão de Cardápio:
Ferramenta para criar/editar tamanhos e preços das quentinhas.
Adicionar/editar/pausar as opções de alimentos para montagem (com foto e descrição).
Definir regras de negócio (Ex: "Até 3 acompanhamentos", "1 proteína obrigatória").
Configurações do Restaurante:
Definir horário de funcionamento, áreas de entrega (por CEP ou raio), taxas de entrega (fixa, por bairro/distância).
Configurar chaves PIX e credenciais do gateway de pagamento.
Controle de Entregas:
Visualizar a localização dos entregadores ativos em um mapa.
Atribuir pedidos a entregadores específicos.
Relatórios Simples: Dashboard com dados essenciais: faturamento (diário/semanal), número de pedidos e itens mais pedidos.

3. Modo Entregador (Interface Web - Otimizada para Mobile)
Objetivo: Fornecer ao entregador as ferramentas necessárias para realizar a entrega de forma rápida e comunicar-se de maneira eficaz.
Design e UI:
Interface minimalista com botões grandes e informações diretas para uso em movimento.
Funcionalidades Essenciais:
Fila de Entregas: Visualização simples das entregas atribuídas com endereço do cliente e valor do pedido.
Navegação Integrada: Botão "Iniciar Rota" que abre o endereço do cliente diretamente no Google Maps ou Waze.
Atualização de Status: Botões de um clique para atualizar o status, que será refletido para o cliente e para o restaurante: "Iniciei a entrega", "Cheguei ao local".
Comunicação: Acesso a um chat simples ou botão para enviar mensagens de voz para o restaurante.
Confirmação de Entrega:
Campo para inserir um código de confirmação (que o cliente recebe em sua página de status).
Ao inserir o código correto, o pedido é finalizado e o status é atualizado para "Entregue" em todo o sistema.
4. Integrações e Tecnologia
Gateway de Pagamento: Integração nativa com Mercado Pago ou Stripe para processar pagamentos via PIX e Cartão de Crédito.
Serviços de Mapa: Uso da API do Google Maps para geolocalização, cálculo de rotas e visualização em tempo real.
API do WhatsApp: Integração para automação de notificações transacionais (confirmação de pedido, status de entrega) e, opcionalmente, para um chatbot de atendimento inicial.
Inteligência Artificial (Opcional - Fase 2): Integração com um agente de IA para responder a perguntas frequentes na interface do cliente, como horário de funcionamento e taxa de entrega, antes de direcionar para um atendente humano.

Fluxo Detalhado para Criação e Acesso ao Subdomínio da Loja
1. Landing Page (quentinhas.net) e Login (quentinhas.net/login)
quentinhas.net: Sua landing page institucional.

quentinhas.net/login: A página de login centralizada.

Quando o usuário faz login aqui, o backend autentica e, como discutido, armazena o user_id e o tenant_id (ou um identificador temporário para o tenant, caso ele ainda não tenha um nome de restaurante definido) na sessão.

Após o login bem-sucedido, o usuário é redirecionado para app.quentinhas.net/dashboard.

2. Dashboard do Usuário (app.quentinhas.net/dashboard)
Este é o ponto central onde o usuário gerencia seu restaurante.

Configuração Inicial do Restaurante:

No dashboard, você terá uma seção onde o usuário pode escolher o nome do restaurante. Este nome será usado para gerar o subdomínio (ex: "To chegando" -> "tochegando").

Validação do Nome: Ao escolher o nome, é crucial que você:

Valide a unicidade: Verifique se o subdomínio gerado (tochegando) já não está em uso por outro restaurante.

Valide o formato: Garanta que o nome seja compatível com um subdomínio (sem espaços, caracteres especiais, etc. - geralmente, converta para "slug" ou "kebab-case").

Armazenamento no Banco de Dados: Uma vez validado e aceito, o "slug" do subdomínio (tochegando) é armazenado no registro do tenant no seu banco de dados.

3. Geração e Ativação do Subdomínio (Backend e DNS)
Esta é a parte mais técnica e envolve a automação.

No Backend (Após o usuário salvar o nome do restaurante):

Atualize o registro do Tenant: O nome do subdomínio (tochegando) é associado ao tenant_id do usuário no seu banco de dados.

Dispare um Evento/Processo: Seu backend precisa iniciar um processo para "ativar" esse subdomínio. Isso geralmente envolve interagir com seu provedor de DNS.

Configuração de DNS (Wildcard DNS já configurado):

Como você já tem um Wildcard DNS (*.quentinhas.net) apontando para o seu servidor, você não precisa criar um novo registro DNS para cada subdomínio individualmente. Isso é a beleza do wildcard!

Qualquer requisição para tochegando.quentinhas.net já será direcionada para o seu servidor.

Servidor Web (Nginx/Apache/Balanceador de Carga):

Seu servidor web (ou balanceador de carga, como AWS ALB, Google Cloud Load Balancer) já estará configurado para aceitar requisições para *.quentinhas.net.

Ele passará o Host header (tochegando.quentinhas.net) para sua aplicação.

4. Roteamento e Carregamento da Loja (Frontend e Backend)
Quando alguém acessa tochegando.quentinhas.net:

No Backend (Middleware):

Extraia o Subdomínio: Seu middleware (o mesmo que você usa para app.quentinhas.net) deve inspecionar o Host header da requisição (tochegando.quentinhas.net).

Identifique o Tenant: Com base em tochegando, o middleware consulta seu banco de dados para encontrar o tenant_id correspondente.

Carregue os Dados da Loja: Uma vez que o tenant_id é identificado, sua aplicação sabe qual loja está sendo acessada.

No Frontend (Se for uma SPA ou SSR):

Se sua aplicação de loja for uma Single Page Application (SPA) ou usar Server-Side Rendering (SSR), o frontend receberá os dados do backend já filtrados para o tochegando.

O frontend então renderiza a página da loja com os produtos, informações e branding específicos do restaurante "To chegando".

5. Certificados SSL (HTTPS)
Certificado Wildcard SSL: Se você já tem um certificado SSL wildcard (*.quentinhas.net), ele cobrirá automaticamente tochegando.quentinhas.net, garantindo que a loja seja acessível via HTTPS.

Resumo do Fluxo Simplificado:
Login em quentinhas.net/login.

Redirecionamento para app.quentinhas.net/dashboard.

No dashboard, o usuário escolhe o nome do restaurante ("To chegando").

O backend salva "tochegando" como o slug do subdomínio para aquele tenant no banco de dados.

Nenhuma ação manual de DNS é necessária porque o *.quentinhas.net wildcard já está configurado.

Quando tochegando.quentinhas.net é acessado, seu backend usa o subdomínio para identificar o tenant e carregar os dados corretos da loja.

Essa abordagem é eficiente e escalável, pois a criação de um novo subdomínio para um usuário se torna uma simples atualização no banco de dados, sem intervenção manual no DNS para cada novo cliente.