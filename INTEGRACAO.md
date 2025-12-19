# Guia de Integração - SA Painel

## 📋 Visão Geral

Camada de integração completa entre o frontend React e backend REST, com suporte a configuração dinâmica de ambientes para deploy em IIS, Docker, Nginx, Azure e AWS.

## 🔧 Configuração de Ambientes

### Desenvolvimento Local

O projeto usa **variáveis de ambiente do Vite** + **configuração em runtime** para máxima flexibilidade.

#### Arquivo `.env` (desenvolvimento)
```env
VITE_API_BASE_URL=http://localhost:8180/api
VITE_API_TIMEOUT=15000
VITE_USE_MSW=true
```

- `VITE_API_BASE_URL`: URL base do backend de desenvolvimento
- `VITE_API_TIMEOUT`: Timeout em milissegundos para requisições
- `VITE_USE_MSW`: Define se o MSW (Mock Service Worker) deve ser habilitado

#### Testando com API Real em Dev

Para desabilitar os mocks e apontar para a API real:

```env
VITE_USE_MSW=false
VITE_API_BASE_URL=http://localhost:8180/api
```

### Produção

#### Arquivo `.env.production`
```env
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=20000
```

**Importante**: Em produção, use caminhos relativos (`/api`) para permitir que a aplicação rode em qualquer domínio.

#### Configuração em Runtime (`public/app-config.json`)

Permite **alterar a URL da API sem rebuild**:

```json
{
  "VITE_API_BASE_URL": "https://api.exemplo.com.br/v1"
}
```

**Prioridade de carregamento**:
1. `window.__APP_CONFIG__` (carregado de `app-config.json`)
2. Variáveis do Vite (`import.meta.env`)
3. Valor padrão (`/api`)

## 🚀 Deploy

### IIS (Internet Information Services)

1. **Build de produção**:
   ```bash
   npm run build
   ```

2. **Copiar pasta `dist/` para o servidor IIS**

3. **Configurar `web.config`** na raiz da aplicação:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="SPA Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
       <staticContent>
         <mimeMap fileExtension=".json" mimeType="application/json" />
       </staticContent>
     </system.webServer>
   </configuration>
   ```

4. **Editar `app-config.json`** na pasta de deploy:
   ```json
   {
     "VITE_API_BASE_URL": "https://seu-servidor.com/api"
   }
   ```

### Docker

**Dockerfile**:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location /api {
    proxy_pass http://backend:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./app-config.json:/usr/share/nginx/html/app-config.json
    depends_on:
      - backend

  backend:
    image: seu-backend:latest
    ports:
      - "8080:8080"
```

**Comandos**:
```bash
docker-compose up -d
```

### Nginx (Standalone)

1. **Build**:
   ```bash
   npm run build
   ```

2. **Copiar `dist/` para `/var/www/html/painel`**

3. **Configurar Nginx** (`/etc/nginx/sites-available/painel`):
   ```nginx
   server {
     listen 80;
     server_name painel.exemplo.com.br;
     root /var/www/html/painel;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     location /api {
       proxy_pass http://localhost:8180;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

4. **Ativar site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/painel /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Azure Static Web Apps

1. **Criar `staticwebapp.config.json`** na raiz:
   ```json
   {
     "navigationFallback": {
       "rewrite": "/index.html",
       "exclude": ["/assets/*", "/*.{css,js,jpg,png,gif,ico,svg}"]
     },
     "routes": [
       {
         "route": "/api/*",
         "allowedRoles": ["anonymous"]
       }
     ],
     "responseOverrides": {
       "404": {
         "rewrite": "/index.html",
         "statusCode": 200
       }
     }
   }
   ```

2. **Deploy via GitHub Actions** ou Azure CLI

### AWS S3 + CloudFront

1. **Build**:
   ```bash
   npm run build
   ```

2. **Upload para S3**:
   ```bash
   aws s3 sync dist/ s3://seu-bucket --delete
   ```

3. **Configurar CloudFront** com:
   - Origin: Bucket S3
   - Default Root Object: `index.html`
   - Error Pages: 403/404 → `/index.html` (código 200)

4. **API Gateway** ou **ALB** para proxy `/api` ao backend

## 📡 Estrutura da Integração

### Serviços HTTP

- **`src/config/apiConfig.js`**: Configuração centralizada (BASE_URL, TIMEOUT)
- **`src/services/httpClient.js`**: Cliente Axios com interceptors
- **`src/services/api/auth.js`**: Endpoints de autenticação
- **`src/services/api/filas.js`**: Endpoints de filas/integrações

### Interceptors

#### Request
- Adiciona `Authorization: Bearer <token>` automaticamente
- Lê token de `localStorage`

#### Response
- Detecta erro 401 (Unauthorized) e dispara hook `onUnauthorized`
- Integrado com `AuthContext` para logout automático

### Tratamento de Erros

Todos os serviços seguem o padrão:
```javascript
try {
  const data = await getFilas()
  // sucesso
} catch (error) {
  // error.message contém mensagem amigável
  setError(error.message)
}
```

Respostas esperadas da API:
```json
{
  "success": true,
  "data": [...],
  "message": "Operação concluída"
}
```

Em caso de erro (`success: false`), o serviço lança exceção com a mensagem.

## 🧪 Mocks (MSW)

### Habilitar/Desabilitar

Em **desenvolvimento**:
- Habilitado por padrão
- Desabilitar: `VITE_USE_MSW=false` no `.env`

Em **produção**:
- Automaticamente desabilitado

### Handlers

Localizados em `src/services/mocks/`:
- `handlers.js`: Exporta todos os handlers
- `dashboard.js`: Mock GET `/dashboard`
- `filas.js`: Mock GET `/filas`, GET `/filas/:id/logs`, POST `/filas/:id/reprocessar`

## 🔐 Autenticação

### Fluxo

1. **Login**: POST `/login` → retorna `{ token, user }`
2. **Armazenamento**: Token salvo em `localStorage`
3. **Uso**: Header `Authorization` adicionado automaticamente
4. **Logout**: Token removido + redirecionamento

### Proteção de Rotas

```jsx
<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/filas" element={<FilasPage />} />
</Route>
```

## 📊 Enums e Formatação

### Status
- Numérico: `1 = success`, `2 = error`, `3 = warning`, `0 = neutral`
- String: `'success'`, `'error'`, `'warning'`, `'neutral'`
- Helper: `toStatus(value)`, `statusLabel(status)`, `statusColor(status)`

### Fluxo/Segmento
- Numérico: `1 = importacao`, `2 = exportacao`, `3 = validacao`
- Helper: `toFluxo(value)`, `fluxoLabel(fluxo)`

### Tipo de Objeto
- Numérico: `1 = pedido`, `2 = nota`, `3 = produto`
- Helper: `toTipo(value)`, `tipoLabel(tipo)`

### Método/Operação
- Numérico: `1 = create`, `2 = update`, `3 = delete`, `4 = consulta`
- Helper: `toMetodo(value)`, `metodoLabel(metodo)`

## 🎨 Componentes Principais

### JsonViewer
Exibe JSON formatado com:
- Pretty-print automático
- Botão copiar para área de transferência
- Scroll em payloads grandes
- Modal responsivo

### Table (React Table v8)
- Ordenação por colunas
- Filtro global (busca)
- Paginação
- Skeleton loading
- Ações contextuais (ver, logs, reprocessar, JSON)

### Badge
Indicadores visuais com cores semânticas:
- Verde: Sucesso
- Vermelho: Erro
- Âmbar: Aviso
- Cinza: Neutro

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento com mocks
npm run dev

# Desenvolvimento com API real
VITE_USE_MSW=false npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📦 Dependências Principais

- **axios**: Cliente HTTP
- **react-router-dom**: Roteamento SPA
- **@tanstack/react-table**: Tabelas avançadas
- **recharts**: Gráficos
- **framer-motion**: Animações
- **msw**: Mock Service Worker (dev only)

## ⚙️ Variáveis Suportadas

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_BASE_URL` | `/api` | URL base da API |
| `VITE_API_TIMEOUT` | `15000` | Timeout de requisições (ms) |
| `VITE_USE_MSW` | `true` | Habilita mocks em dev |

## 🐛 Troubleshooting

### CORS em desenvolvimento

Se a API estiver em outro domínio/porta, configure o proxy no `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8180',
        changeOrigin: true,
      }
    }
  }
})
```

### Token não sendo enviado

Verifique:
1. Token está em `localStorage.getItem('token')`
2. Interceptor está configurado em `httpClient.js`
3. Rota não está bloqueada por CORS

### Build não reflete mudanças de `app-config.json`

- `app-config.json` é carregado em **runtime** (não no build)
- Limpe cache do navegador (Ctrl+Shift+R)
- Verifique se o arquivo está acessível em `/app-config.json`

---

**Última atualização**: 17 de dezembro de 2025
