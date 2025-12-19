# SA Painel de Integração (React + Vite)

Projeto React (JavaScript) com Vite, Tailwind CSS, React Router, Framer Motion, Recharts, React Table v8 e MSW.

## Rodar localmente

```bash
npm install
npm run dev
```

O MSW (Mock Service Worker) inicia automaticamente em desenvolvimento. A aplicação abre em http://localhost:5173 ou na próxima porta disponível.

## Funcionalidades principais

- Tema claro/escuro com toggle e persistência via localStorage
- Layout fixo: Header + Sidebar recolhível + conteúdo fluido 100%
- Tela de Login com validações, animações e mock `POST /login`
- Dashboard com KPIs animados, gráfico de barras e skeleton loading (`GET /dashboard`)
- Página de Filas com tabela (ordenar/filtrar/paginar), modais de detalhes e logs, reprocessamento (`/filas`)

## Estrutura (arquivos-chave)

- Páginas: `src/pages/LoginPage.jsx`, `src/pages/DashboardPage.jsx`, `src/pages/FilasPage.jsx`
- Contextos: `src/contexts/AuthContext.jsx`, `src/contexts/ThemeContext.jsx`
- Comuns: `src/components/common/*` (Input, Button, Card, Skeleton, Badge)
- Layout: `src/components/layout/*` (Header, Sidebar)
- Tabela/Modais: `src/components/table/*`, `src/components/modals/*`
- Gráfico/KPIs: `src/components/charts/*`, `src/components/kpi/*`
- MSW: `src/services/mocks/*` (handlers, dashboard, filas) + `public/mockServiceWorker.js`

## Login de teste

- Email: `admin@admin.com`
- Senha: `admin`

## Build

```bash
npm run build
npm run preview
```

