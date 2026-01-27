# Gestão de Estoque - Tapeçaria

Sistema de controle de estoque desenvolvido para gerenciar movimentações de tecidos em uma tapeçaria. A aplicação permite registrar entradas e saídas de materiais, acompanhar estatísticas em tempo real e gerenciar cadastros de tecidos, operadores e motivos de movimentação.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para facilitar o controle de estoque de tecidos em uma tapeçaria, oferecendo uma interface moderna e intuitiva para registro de movimentações e gestão administrativa. O sistema utiliza Supabase como backend, proporcionando sincronização em tempo real e armazenamento seguro dos dados.

> **📦 Para Deploy em Produção**: Veja o arquivo [DEPLOY.md](./DEPLOY.md) para instruções completas sobre como configurar e executar o projeto usando PM2.

## ✨ Funcionalidades

### Página Principal (`/`)
- **Registro de Movimentações**: Interface para registrar entradas e saídas de tecidos
- **Seleção de Tecido**: Combobox com busca para selecionar tecidos cadastrados
- **Controle de Quantidade**: Stepper para ajustar quantidade de forma intuitiva
- **Seleção de Motivo**: Chips para escolher o motivo da movimentação
- **Seleção de Operador**: Dropdown para escolher o operador responsável
- **Validação de Formulário**: Validação completa antes de submeter
- **Feedback Visual**: Notificações toast para sucesso e erro

### Painel Administrativo (`/admin`)
- **Dashboard**: Visão geral com estatísticas do dia
- **Resumo de Movimentações**: Total de entradas e saídas do dia atual
- **Lista de Movimentações**: Tabela com histórico recente de movimentações
- **Filtros Avançados**: Filtros por tecido e intervalo de datas
- **Resumo por Tecido**: Visualização do estoque atual por tecido

### Páginas de Gestão

#### `/admin/tecidos`
- Visualização do total de tecidos cadastrados
- Formulário para adicionar novos tecidos
- Tabela com lista completa de tecidos
- Exclusão de tecidos com confirmação

#### `/admin/operadores`
- Visualização do total de operadores cadastrados
- Formulário para adicionar novos operadores
- Tabela com lista completa de operadores
- Exclusão de operadores com confirmação

#### `/admin/motivos`
- Visualização do total de motivos cadastrados
- Formulário para adicionar novos motivos
- Tabela com lista completa de motivos
- Exclusão de motivos com confirmação

## 🛣️ Rotas

O sistema possui as seguintes rotas disponíveis:

| Rota | Descrição | Como Acessar |
|------|-----------|--------------|
| `/` | Página principal (registro de movimentações) | Acesse diretamente pela URL raiz ou `http://localhost:8080/` |
| `/admin` | Dashboard administrativo | **Digite `/admin` na URL** (ex: `http://localhost:8080/admin`). Não há link na página principal. |
| `/admin/tecidos` | Gestão de tecidos | Acesse pelo menu lateral do admin ou digite `/admin/tecidos` na URL |
| `/admin/operadores` | Gestão de operadores | Acesse pelo menu lateral do admin ou digite `/admin/operadores` na URL |
| `/admin/motivos` | Gestão de motivos | Acesse pelo menu lateral do admin ou digite `/admin/motivos` na URL |

> **Nota**: A página principal (`/`) não possui link de navegação para o painel administrativo. Para acessar o admin, digite `/admin` diretamente na barra de endereços do navegador. Uma vez no admin, você pode navegar entre as páginas usando o menu lateral.

## 🚀 Tecnologias

### Frontend
- **React 18.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router DOM** - Roteamento client-side
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **Material-UI Icons** - Biblioteca de ícones do Material Design
- **Material-UI** - Componentes adicionais (CircularProgress)

### Backend & Dados
- **Supabase** - Backend-as-a-Service (banco de dados PostgreSQL e autenticação)
- **React Query** - Gerenciamento de estado servidor e cache de dados

### Outras Bibliotecas
- **Sonner** - Sistema de notificações toast
- **date-fns** - Manipulação e formatação de datas
- **React Hook Form** - Gerenciamento de formulários

## 📁 Estrutura do Projeto

```
fabric-flow/
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Página principal
│   │   ├── Admin.tsx               # Dashboard administrativo
│   │   ├── NotFound.tsx           # Página 404
│   │   └── admin/
│   │       ├── TecidosPage.tsx     # Gestão de tecidos
│   │       ├── OperadoresPage.tsx  # Gestão de operadores
│   │       └── MotivosPage.tsx     # Gestão de motivos
│   ├── components/
│   │   ├── AdminSidebar.tsx        # Sidebar de navegação
│   │   └── inventory/              # Componentes de inventário
│   │       ├── ActionToggle.tsx    # Toggle Entrada/Saída
│   │       ├── TecidoCombobox.tsx  # Seleção de tecido
│   │       ├── QuantityStepper.tsx # Controle de quantidade
│   │       ├── MotivoChips.tsx     # Seleção de motivo
│   │       ├── OperadorSelect.tsx  # Seleção de operador
│   │       └── ManageListDialog.tsx # Dialog de gestão (legado)
│   ├── hooks/
│   │   └── useInventoryData.ts     # Hooks de dados (React Query)
│   ├── integrations/
│   │   └── supabase/
│   │       └── client.ts           # Cliente Supabase
│   └── lib/
│       └── utils.ts                # Utilitários (cn, etc.)
├── public/                          # Arquivos estáticos
├── .env.local                       # Variáveis de ambiente (não versionado)
└── package.json                     # Dependências do projeto
```

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta **Supabase** configurada com projeto criado

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd fabric-flow
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
   
   > **Importante**: Nunca commite o arquivo `.env.local` no repositório. Ele contém informações sensíveis.

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra seu navegador em `http://localhost:8080`

### Configuração do Supabase

Para conectar o projeto ao seu próprio banco de dados Supabase:

1. **Crie um arquivo `.env.local`** na raiz do projeto (copie de `.env.example` se necessário)

2. **Configure as credenciais** no arquivo `.env.local`:

   **Para Supabase Cloud:**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```
   - Encontre essas informações em: **Supabase Dashboard** → **Settings** → **API**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

   **Para Supabase Local (Self-hosted):**
   ```env
   VITE_SUPABASE_URL=http://seu-ip-local:54321
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```
   - Use o IP e porta do seu servidor Supabase local
   - A chave anon geralmente começa com `sb_publishable_`

3. **Crie as tabelas necessárias** no banco de dados:

   ```sql
   -- Tabela de tecidos
   CREATE TABLE est_tecidos (
     id SERIAL PRIMARY KEY,
     nome TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabela de operadores
   CREATE TABLE est_operadores (
     id SERIAL PRIMARY KEY,
     nome TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabela de motivos
   CREATE TABLE est_motivos (
     id SERIAL PRIMARY KEY,
     nome TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabela de movimentações
   CREATE TABLE est_movimentacoes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     tipo_movimentacao TEXT NOT NULL CHECK (tipo_movimentacao IN ('Entrada', 'Saída')),
     tecido TEXT NOT NULL,
     quantidade INTEGER NOT NULL CHECK (quantidade > 0),
     motivo TEXT NOT NULL,
     operador TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Reinicie o servidor de desenvolvimento** após configurar o `.env.local`

> **Importante**: O arquivo `.env.local` está no `.gitignore` e não será commitado. Cada desenvolvedor deve criar o seu próprio arquivo com suas credenciais.

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Gera build otimizado para produção |
| `npm run build:dev` | Gera build em modo desenvolvimento |
| `npm run lint` | Executa o ESLint para verificar código |
| `npm run preview` | Preview local do build de produção |
| `npm run test` | Executa os testes uma vez |
| `npm run test:watch` | Executa os testes em modo watch |

## 🎨 Características Técnicas

- **Design Responsivo**: Interface mobile-first com sidebar colapsável em dispositivos móveis
- **Navegação Client-Side**: React Router DOM para navegação sem recarregamento de página
- **Estado Ativo**: Sidebar destaca automaticamente a página atual usando `useLocation`
- **Performance**: React Query para cache inteligente e sincronização automática de dados
- **Acessibilidade**: Componentes shadcn/ui com suporte completo a ARIA labels
- **Tipografia**: Fonte Inter do Google Fonts aplicada globalmente
- **Ícones Padronizados**: Material-UI Icons em toda a aplicação
- **Feedback Visual**: Sistema de notificações toast para ações do usuário
- **Validação**: Validação de formulários com feedback em tempo real

## 📊 Banco de Dados

O projeto utiliza **Supabase** (PostgreSQL) com as seguintes tabelas:

### `est_tecidos`
Armazena os tecidos cadastrados no sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Chave primária |
| `nome` | TEXT | Nome do tecido (único) |
| `created_at` | TIMESTAMP | Data de criação |

### `est_operadores`
Armazena os operadores cadastrados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Chave primária |
| `nome` | TEXT | Nome do operador (único) |
| `created_at` | TIMESTAMP | Data de criação |

### `est_motivos`
Armazena os motivos de movimentação cadastrados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | SERIAL | Chave primária |
| `nome` | TEXT | Nome do motivo (único) |
| `created_at` | TIMESTAMP | Data de criação |

### `est_movimentacoes`
Registra todas as movimentações de estoque.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária |
| `tipo_movimentacao` | TEXT | 'Entrada' ou 'Saída' |
| `tecido` | TEXT | Nome do tecido |
| `quantidade` | INTEGER | Quantidade movimentada |
| `motivo` | TEXT | Motivo da movimentação |
| `operador` | TEXT | Nome do operador |
| `created_at` | TIMESTAMP | Data e hora da movimentação |

## 🔒 Segurança

- **Variáveis de Ambiente**: Credenciais sensíveis armazenadas em `.env.local` (não versionado)
- **Row Level Security**: Configure RLS no Supabase para proteger os dados
- **Validação**: Validação tanto no frontend quanto no backend (constraints do banco)
- **HTTPS**: Use sempre HTTPS em produção

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e de uso interno.

## 🆘 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
