# 🔄 Plano de Migração - Single-Tenant para Multi-Tenant

## 📋 Visão Geral

Este documento detalha o processo de migração da aplicação atual (single-tenant) para a arquitetura multi-tenant, preservando os dados existentes e garantindo zero downtime.

## 🎯 Objetivos da Migração

1. **Preservar dados existentes**: Migrar dados atuais para o novo schema
2. **Zero downtime**: Migração sem interrupção do serviço
3. **Rollback seguro**: Possibilidade de reverter em caso de problemas
4. **Validação completa**: Testes extensivos antes da migração final

## 📊 Análise do Estado Atual

### Dados Existentes
- Produtos hardcoded no componente Index.tsx
- Sem persistência de dados de usuários
- Sem sistema de pedidos persistente
- Configurações de tema no CSS

### Estrutura Atual
```
src/
├── components/
├── pages/
├── integrations/supabase/
└── assets/
```

## 🗄️ Schema de Migração

### 1. Criação das Tabelas Multi-Tenant

```sql
-- migrations/001_create_multi_tenant_schema.sql

-- Tabela de Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address JSONB,
  domain VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan VARCHAR(50) DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('super_admin', 'tenant_admin', 'staff', 'customer')),
  profile JSONB DEFAULT '{}',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  max_selections INTEGER DEFAULT 1,
  min_selections INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  ingredients JSONB DEFAULT '[]',
  nutritional_info JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  customer_info JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  notes TEXT,
  estimated_delivery TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Assinaturas
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_products_tenant_category ON products(tenant_id, category_id);
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);

-- Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Função para definir tenant atual
CREATE OR REPLACE FUNCTION set_current_tenant_id(tenant_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas RLS
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_categories ON categories
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_products ON products
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_orders ON orders
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_subscriptions ON subscriptions
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);
```

### 2. Migração dos Dados Existentes

```sql
-- migrations/002_migrate_existing_data.sql

-- Criar tenant padrão para dados existentes
INSERT INTO tenants (
  slug,
  name,
  email,
  status,
  plan,
  theme,
  settings
) VALUES (
  'quentinhas-express',
  'Quentinhas Express',
  'admin@quentinhas.com',
  'active',
  'professional',
  '{
    "colors": {
      "primary": "#FF6B35",
      "secondary": "#E63946", 
      "accent": "#F77F00",
      "background": "#FFFFFF"
    },
    "logo": "/assets/logo-quentinhas.jpg",
    "fonts": {
      "primary": "Inter",
      "secondary": "Inter"
    }
  }',
  '{
    "restaurantName": "Quentinhas Express",
    "deliveryTime": "30-45 min",
    "location": "Centro, São Paulo",
    "isOpen": true
  }'
);

-- Obter ID do tenant criado
DO $$
DECLARE
  tenant_uuid UUID;
BEGIN
  SELECT id INTO tenant_uuid FROM tenants WHERE slug = 'quentinhas-express';
  
  -- Criar categorias baseadas nos dados hardcoded
  INSERT INTO categories (tenant_id, name, description, max_selections, min_selections, sort_order) VALUES
  (tenant_uuid, 'Base', 'Escolha a base da sua quentinha', 1, 1, 1),
  (tenant_uuid, 'Proteína', 'Escolha sua proteína preferida', 1, 1, 2),
  (tenant_uuid, 'Acompanhamentos', 'Escolha até 2 acompanhamentos', 2, 0, 3),
  (tenant_uuid, 'Salada', 'Escolha até 3 tipos de salada', 3, 0, 4);
  
  -- Criar produtos baseados nos dados hardcoded
  -- Base
  INSERT INTO products (tenant_id, category_id, name, description, price, image_url, sort_order) VALUES
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Base' LIMIT 1), 
   'Arroz Branco', 'Arroz soltinho e temperado', 0.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop', 1),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Base' LIMIT 1), 
   'Arroz Integral', 'Opção mais saudável e nutritiva', 0.00, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop', 2);
  
  -- Proteína
  INSERT INTO products (tenant_id, category_id, name, description, price, image_url, sort_order) VALUES
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Proteína' LIMIT 1), 
   'Frango Grelhado', 'Peito de frango temperado e grelhado', 0.00, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 1),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Proteína' LIMIT 1), 
   'Carne Moída', 'Carne moída refogada com temperos', 0.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop', 2),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Proteína' LIMIT 1), 
   'Peixe Grelhado', 'Filé de peixe grelhado com ervas', 0.00, 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop', 3);
  
  -- Acompanhamentos
  INSERT INTO products (tenant_id, category_id, name, description, price, image_url, sort_order) VALUES
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Acompanhamentos' LIMIT 1), 
   'Feijão Carioca', 'Feijão temperado tradicional', 0.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop', 1),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Acompanhamentos' LIMIT 1), 
   'Feijão Preto', 'Feijão preto cremoso', 0.00, 'https://images.unsplash.com/photo-1605032105622-18d26dcd4500?w=400&h=300&fit=crop', 2),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Acompanhamentos' LIMIT 1), 
   'Farofa', 'Farofa crocante com bacon', 0.00, 'https://images.unsplash.com/photo-1574663253572-66a8c2b9d3f8?w=400&h=300&fit=crop', 3),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Acompanhamentos' LIMIT 1), 
   'Batata Frita', 'Batatas douradas e crocantes', 0.00, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop', 4);
  
  -- Salada
  INSERT INTO products (tenant_id, category_id, name, description, price, image_url, sort_order) VALUES
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Salada' LIMIT 1), 
   'Alface', 'Folhas frescas e crocantes', 0.00, 'https://images.unsplash.com/photo-1556909045-f9c7b1c8b9d7?w=400&h=300&fit=crop', 1),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Salada' LIMIT 1), 
   'Tomate', 'Tomates frescos em cubos', 0.00, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', 2),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Salada' LIMIT 1), 
   'Cenoura Ralada', 'Cenoura fresca ralada', 0.00, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop', 3),
  (tenant_uuid, (SELECT id FROM categories WHERE tenant_id = tenant_uuid AND name = 'Salada' LIMIT 1), 
   'Pepino', 'Pepino em fatias finas', 0.00, 'https://images.unsplash.com/photo-1552944150-6dd1180e5999?w=400&h=300&fit=crop', 4);
  
  -- Criar usuário admin padrão
  INSERT INTO users (tenant_id, email, role, profile) VALUES
  (tenant_uuid, 'admin@quentinhas.com', 'tenant_admin', '{"name": "Administrador", "phone": "+55 11 99999-9999"}');
  
  -- Criar assinatura padrão
  INSERT INTO subscriptions (tenant_id, plan, current_period_start, current_period_end) VALUES
  (tenant_uuid, 'professional', NOW(), NOW() + INTERVAL '1 month');
  
END $$;
```

## 🔄 Processo de Migração

### Etapa 1: Preparação (Dia 1)
1. **Backup completo** do banco atual
2. **Criar branch de migração** no Git
3. **Setup ambiente de staging** idêntico à produção
4. **Executar migrações no staging**

### Etapa 2: Validação (Dia 2-3)
1. **Testes automatizados** das migrações
2. **Validação manual** dos dados migrados
3. **Testes de performance** com dados reais
4. **Validação de RLS** e isolamento

### Etapa 3: Migração Produção (Dia 4)
1. **Modo manutenção** (5 minutos máximo)
2. **Executar migrações** em produção
3. **Deploy nova versão** da aplicação
4. **Validação pós-migração**
5. **Remover modo manutenção**

### Etapa 4: Monitoramento (Dia 5-7)
1. **Monitorar logs** e métricas
2. **Validar funcionalidades** críticas
3. **Feedback dos usuários**
4. **Ajustes finos** se necessário

## 🧪 Plano de Testes

### Testes de Migração
```sql
-- Verificar integridade dos dados
SELECT 
  t.name as tenant_name,
  COUNT(DISTINCT c.id) as categories_count,
  COUNT(DISTINCT p.id) as products_count,
  COUNT(DISTINCT u.id) as users_count
FROM tenants t
LEFT JOIN categories c ON c.tenant_id = t.id
LEFT JOIN products p ON p.tenant_id = t.id  
LEFT JOIN users u ON u.tenant_id = t.id
GROUP BY t.id, t.name;

-- Verificar RLS
SET app.current_tenant_id = 'tenant-uuid-here';
SELECT COUNT(*) FROM products; -- Deve retornar apenas produtos do tenant

-- Verificar isolamento
SET app.current_tenant_id = 'outro-tenant-uuid';
SELECT COUNT(*) FROM products; -- Deve retornar 0 ou produtos de outro tenant
```

### Testes Funcionais
1. **Resolução de tenant** por subdomínio
2. **Aplicação de tema** por tenant
3. **Isolamento de dados** entre tenants
4. **Funcionalidades básicas** (criar pedido, etc.)

## 🚨 Plano de Rollback

### Cenários de Rollback
1. **Falha na migração**: Restaurar backup
2. **Problemas de performance**: Otimizar queries
3. **Bugs críticos**: Hotfix ou rollback
4. **Problemas de RLS**: Ajustar políticas

### Procedimento de Rollback
```sql
-- 1. Desabilitar RLS temporariamente
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ... outras tabelas

-- 2. Restaurar backup se necessário
-- pg_restore backup_pre_migration.sql

-- 3. Deploy versão anterior da aplicação

-- 4. Validar funcionamento

-- 5. Reabilitar RLS com políticas corretas
```

## 📊 Métricas de Sucesso

### Técnicas
- **Zero downtime**: < 5 minutos de indisponibilidade
- **Integridade dos dados**: 100% dos dados migrados
- **Performance**: Tempo de resposta < 200ms
- **Isolamento**: 0 vazamentos entre tenants

### Negócio
- **Funcionalidades**: 100% das features funcionando
- **Usuários**: 0 reclamações críticas
- **Conversão**: Manter taxa atual
- **Satisfação**: > 95% de aprovação

## 🔧 Ferramentas e Scripts

### Scripts de Migração
```bash
#!/bin/bash
# migrate.sh

echo "Iniciando migração multi-tenant..."

# 1. Backup
pg_dump $DATABASE_URL > backup_pre_migration_$(date +%Y%m%d_%H%M%S).sql

# 2. Executar migrações
psql $DATABASE_URL -f migrations/001_create_multi_tenant_schema.sql
psql $DATABASE_URL -f migrations/002_migrate_existing_data.sql

# 3. Validar
psql $DATABASE_URL -f tests/validate_migration.sql

echo "Migração concluída!"
```

### Monitoramento
```sql
-- Queries para monitoramento pós-migração
CREATE VIEW migration_health AS
SELECT 
  'tenants' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_created
FROM tenants
UNION ALL
SELECT 
  'products' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as last_created  
FROM products;
```

## 📅 Timeline Detalhado

### Semana 1: Preparação
- **Dia 1-2**: Criar migrações e scripts
- **Dia 3-4**: Testes em ambiente local
- **Dia 5**: Setup ambiente staging

### Semana 2: Validação
- **Dia 1-2**: Executar migração em staging
- **Dia 3-4**: Testes extensivos
- **Dia 5**: Ajustes e correções

### Semana 3: Produção
- **Dia 1**: Migração em produção
- **Dia 2-5**: Monitoramento intensivo
- **Dia 6-7**: Documentação e retrospectiva

## ✅ Checklist de Migração

### Pré-Migração
- [ ] Backup completo realizado
- [ ] Migrações testadas em staging
- [ ] Scripts de rollback preparados
- [ ] Equipe alinhada e disponível
- [ ] Monitoramento configurado

### Durante Migração
- [ ] Modo manutenção ativado
- [ ] Migrações executadas com sucesso
- [ ] Dados validados
- [ ] Nova versão deployada
- [ ] Testes básicos executados

### Pós-Migração
- [ ] Modo manutenção desativado
- [ ] Funcionalidades críticas testadas
- [ ] Métricas normalizadas
- [ ] Usuários notificados
- [ ] Documentação atualizada

Esta migração estabelece a base sólida para o sistema multi-tenant, preservando todos os dados existentes e garantindo uma transição suave para a nova arquitetura.