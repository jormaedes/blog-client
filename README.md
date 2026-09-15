# Editorial — Frontend Público do Blog

Aplicação web moderna, responsiva e editorial desenvolvida em **Next.js (App Router)**, **TypeScript** e **Tailwind CSS**, que serve como o **frontend público** para os leitores do blog.

Os visitantes podem navegar livremente, pesquisar artigos, ler conteúdos com tipografia confortável e interagir através de gostos e comentários quando autenticados.

---

## 🌟 Principais Funcionalidades

### 📖 Leitura e Navegação Pública (Sem Autenticação Obrigatória)
- **Acesso Livre aos Artigos**: Os visitantes podem aceder à homepage, listar todos os artigos e ler o conteúdo integral sem necessidade de login.
- **Deteção e Capa Automática dos Artigos**: O frontend deteta a primeira imagem presente no conteúdo HTML de cada artigo e utiliza-a como imagem de fundo (*cover*) do card, acompanhada de um gradiente escuro de alto contraste para leitura ideal.
- **Fallback Tipográfico Minimalista**: Caso o artigo não possua imagens, é apresentado um design tipográfico neutro e elegante, sem recurso a imagens falsas ou aleatórias.
- **Pesquisa em Tempo Real por Título**: Filtro client-side reativo, sem necessidade de recarregar a página, que ignora maiúsculas/minúsculas e espaços extras.
- **Paginação Fluida**: Paginação adaptada que funciona em conjunto com a pesquisa e reinicia automaticamente ao pesquisar.
- **Página de Leitura Individual**: Apresentação editorial com banner em destaque, tipografia rica (`@tailwindcss/typography`), estimativa do tempo de leitura e data de publicação.

### 💬 Interação e Comunidade
- **Gostos em Artigos e Comentários**:
  - Utilizadores autenticados podem dar e remover gosto em artigos e comentários.
  - Visitantes não autenticados visualizam a contagem total de gostos e recebem um modal explicativo caso cliquem para interagir.
- **Sistema de Comentários**:
  - Leitura pública de todos os comentários.
  - Renderização estritamente em texto simples (proteção contra injeção de HTML malicioso).
  - Formulário para criação de novos comentários para utilizadores autenticados.
  - Edição e eliminação dos próprios comentários.
  - Permissão para o autor do artigo moderar/eliminar comentários no seu artigo.

### 🔐 Autenticação de Leitores
- **Início de Sessão (`/login`)**: Autenticação com JWT compatível com todos os tipos de utilizador (`READER` e `AUTHOR`), com suporte a redirecionamento pós-login (`?redirect=...`).
- **Registo de Novos Leitores (`/signup`)**: Criação de conta com validação de campos e palavras-passe.
- **Gestão de Sessão**: Armazenamento e restauração automática do token JWT através de uma *store* Zustand.

### 🎨 Experiência de Utilizador e Design
- **100% Responsivo**: Layout otimizado para ecrãs móveis (320px, 375px), tablets (768px) e desktops (1024px, 1440px+).
- **Menu Mobile com Overlay**: Gaveta de navegação móvel com animação suave, bloqueio de scroll ao abrir e fecho automático na navegação.
- **Modo Claro / Escuro / Sistema**: Alternador de tema no Header com persistência através de `next-themes`.
- **Estados de Carregamento e Vazios**: Skeletons discretos de carregamento e mensagens informativas em caso de ausência de resultados ou falhas de rede.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (App Router & React 19)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Tipografia**: [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Gestão de Estado**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Temas**: [next-themes](https://github.com/pacocoursey/next-themes)

---

## 📁 Estrutura do Projeto

```text
src/
├── app/
│   ├── layout.tsx             # Layout global (Header, Footer, ThemeProvider, AuthInitializer)
│   ├── page.tsx               # Homepage (Hero, pesquisa, artigo em destaque, últimos artigos)
│   ├── globals.css            # Configurações globais de estilo e Tailwind v4
│   ├── posts/
│   │   ├── page.tsx           # Catálogo de artigos com pesquisa e paginação
│   │   └── [postId]/
│   │       └── page.tsx       # Leitura individual do artigo com comentários e gostos
│   ├── login/
│   │   └── page.tsx           # Página pública de login
│   └── signup/
│       └── page.tsx           # Página pública de registo de leitor
├── components/
│   ├── Header.tsx             # Header principal com navegação, tema, auth e menu mobile
│   ├── Footer.tsx             # Rodapé editorial com navegação e créditos
│   ├── PostCard.tsx           # Card editorial com extração de capa ou fallback
│   ├── PostGrid.tsx           # Grelha de cards com skeletons e empty states
│   ├── PostContent.tsx        # Renderizador de HTML do TinyMCE com classes prose
│   ├── PostLikeButton.tsx     # Botão de gosto com verificação de autenticação
│   ├── SearchBar.tsx          # Campo de pesquisa reativo com botão de limpar
│   ├── Pagination.tsx         # Componente de paginação acessível
│   ├── CommentList.tsx        # Lista segura de comentários com ações (editar/eliminar/gosto)
│   ├── CommentForm.tsx        # Formulário de comentário ou convite a iniciar sessão
│   ├── AuthPromptModal.tsx    # Modal para convidar visitantes a autenticarem-se
│   ├── ConfirmDialog.tsx      # Diálogo de confirmação para ações destrutivas
│   ├── ThemeProvider.tsx      # Provedor de tema claro/escuro
│   ├── ThemeSwitcher.tsx      # Alternador de tema (Light / System / Dark)
│   └── AuthInitializer.tsx    # Restaurador do estado de autenticação no arranque
├── lib/
│   ├── api.ts                 # Funções de integração com a API REST
│   └── postUtils.ts           # Utilitários para extração de imagens, resumos, datas e tempo de leitura
├── stores/
│   └── authStore.ts           # Store global Zustand para utilizador e sessão JWT
└── types/
    ├── auth.ts                # Tipos de utilizador e respostas de autenticação
    ├── comment.ts             # Tipos de comentários e comentários recentes
    └── post.ts                # Tipos de artigos e autores
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
- Instância ativa do backend **Blog API**

### 1. Clonar o repositório
```bash
git clone https://github.com/jormaedes/blog-client.git
cd blog-client
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Cria um ficheiro `.env.local` na raiz do projeto com o endereço da API:
```env
NEXT_PUBLIC_API_URL=http://localhost:3300
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará acessível em:
```
http://localhost:3000
```

---

## 📦 Build para Produção

Para compilar e iniciar a versão de produção:

```bash
# Gerar a build otimizada
npm run build

# Iniciar o servidor de produção
npm start
```

---

## 🔒 Variáveis de Ambiente

| Variável | Descrição | Exemplo Local | Exemplo Produção |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL base do backend (Blog API) | `http://localhost:3300` | `https://api.o-teu-dominio.com` |

---

## 🔗 Endpoints Consumidos da API

- `GET /posts`: Lista todos os artigos publicados.
- `GET /posts/:postId`: Obtém os detalhes de um artigo específico.
- `GET /posts/:postId/comments`: Lista os comentários associados ao artigo.
- `POST /posts/:postId/comments`: Adiciona um novo comentário (*Requer autenticação*).
- `PUT /comments/:commentId`: Edita um comentário existente (*Requer autor do comentário*).
- `DELETE /comments/:commentId`: Remove um comentário (*Requer autor do comentário ou autor do post*).
- `POST /posts/:postId/like` & `DELETE /posts/:postId/like`: Adiciona/remove gosto no artigo.
- `POST /comments/:commentId/like` & `DELETE /comments/:commentId/like`: Adiciona/remove gosto no comentário.
- `POST /login`: Autentica utilizadores e devolve token JWT.
- `POST /signup`: Regista novos leitores com perfil `READER`.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.