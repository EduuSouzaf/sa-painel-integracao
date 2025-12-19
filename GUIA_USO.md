# 📖 GUIA DE USO - SA PAINEL INTEGRAÇÕES

## 🎯 Visão Geral

O SA Painel Integrações é um sistema de gerenciamento de filas de integração com interface moderna e responsiva.

---

## 🚀 COMEÇAR

### 1. Iniciar o Servidor

```bash
cd sa-painel-integracao
npm install  # Se necessário
npm run dev
```

O servidor iniciará em: **http://localhost:5174/**

### 2. Login

Acesse a tela de login com as credenciais:

```
Email: admin@admin.com
Senha: admin
```

Ou use:

```
Email: user@user.com
Senha: user123
```

---

## 📊 DASHBOARD

### O que Você Vê

| Elemento | Descrição |
|----------|-----------|
| **Total Filas** | Quantidade total de filas no sistema |
| **Sucessos** | Filas processadas com sucesso |
| **Erros** | Filas com erro no processamento |
| **Aguardando** | Filas pendentes (status warning) |
| **Gráfico** | Histórico dos últimos 6 meses |

### Interpretar o Gráfico

- Eixo X: Meses (jan/25, fev/25, etc.)
- Eixo Y: Total de filas processadas
- Barras azuis: Volume de filas por mês

---

## 📋 GERENCIAMENTO DE FILAS

### Acessar a Tela

Clique em **"Filas"** na barra lateral.

### Visualizar Filas

A tabela exibe:

| Coluna | Significado |
|--------|-------------|
| **Dot** | Ponto colorido (🟢 sucesso, 🔴 erro, 🟡 aguardando) |
| **ID** | Identificador único da fila |
| **Data** | Quando a fila foi criada |
| **Base SAP** | Base de dados SAP utilizada |
| **Base Agro** | Base de dados Agro utilizada |
| **Tipo SAP** | Tipo de objeto SAP |
| **Tipo Agro** | Tipo de objeto Agro |
| **Fluxo** | Direção da integração (→) |
| **Método** | HTTP method usado |
| **Status** | Badge colorida (SUCESSO/ERRO/PENDENTE) |
| **ID Objeto SAP** | ID do objeto em SAP |
| **ID Objeto Agro** | ID do objeto em Agro |

### Ações Disponíveis

Clique nos botões de ação:

| Botão | Ação |
|-------|------|
| **Detalhes** (azul escuro) | Abre modal com dados completos |
| **Logs** (azul claro) | Exibe histórico de execução |
| **Reprocessar** (amarelo) | Reenvia a fila (apenas se erro) |
| **Envio** (roxo) | Ver dados enviados (JSON) |
| **Envio Original** (rosa) | Ver dados originais (JSON) |

---

## 🔍 USAR FILTROS

### Abrir Filtros

1. Clique no botão **"Filtros"** na barra superior
2. Um painel com 8 campos de filtro aparecerá

### Campos de Filtro

| Campo | Como Usar |
|-------|-----------|
| **ID da Fila** | Digite números do ID (ex: 123) |
| **Data** | Selecione uma data do calendário |
| **Base SAP** | Nome da base SAP (ex: PROD, DEV) |
| **Base Agro** | Nome da base Agro (ex: PROD, DEV) |
| **Tipo SAP** | Código do tipo SAP |
| **Tipo Agro** | Código do tipo Agro |
| **ID Objeto SAP** | ID do objeto em SAP |
| **ID Objeto Agro** | ID do objeto em Agro |

### Exemplo de Busca

Para encontrar filas de base SAP = "PROD" e base Agro = "DEV":

1. Abra **Filtros**
2. No campo "Base SAP", digite: `PROD`
3. No campo "Base Agro", digite: `DEV`
4. A tabela se atualiza automaticamente
5. Clique **"Limpar Filtros"** para resetar

### Combinar com Busca

Você também pode usar a **barra de busca superior**:

- Digite números para buscar por ID
- Combina com os filtros avançados

---

## 📝 VER DETALHES

### Abrir Modal de Detalhes

1. Clique no botão **"Detalhes"** em qualquer fila
2. Um modal abrirá com todos os dados

### Explorar Dados

Os dados aparecem em abas ou seções:

```
Detalhes:
├─ Código Erro: [código]
├─ Linha: [número]
├─ Classe: [classe Java]
├─ Método: [método]
├─ Envio: [JSON - clique ⬆️ para expandir]
├─ Envio Original: [JSON - clique ⬆️ para expandir]
├─ Resposta: [JSON - clique ⬆️ para expandir]
├─ Stack Trace: [texto]
├─ Mensagem: [mensagem de erro]
└─ XML: [dados XML, se houver]
```

### Expandir JSON

Se um campo JSON está pequeno, clique no ícone **⬆️** ao lado para expandir e ver melhor.

---

## 📖 VER LOGS

### Abrir Logs

1. Clique no botão **"Logs"** em qualquer fila
2. Um modal com histórico de execução aparecerá

### Interpretar Logs

Cada linha de log mostra:

```
[STATUS] [DATA/HORA] [MENSAGEM]
├─ SUCESSO (verde) - Execução bem-sucedida
├─ ERRO (vermelho) - Erro na execução
└─ PENDENTE (amarelo) - Aguardando execução
```

### Detalhes do Log

Clique em uma linha para expandir e ver:

- Código de erro
- Stack trace
- Parâmetros enviados
- JSON de resposta
- XML (se aplicável)

---

## 🔄 REPROCESSAR FILA

### Quando Usar

- Quando uma fila tem **status de erro** (🔴)
- Quando deseja enviar novamente os dados

### Como Fazer

1. Na fila com erro, clique **"Reprocessar"** (amarelo)
2. Uma notificação aparecerá no canto superior direito
3. **Verde** = Sucesso!
4. **Vermelho** = Falha ao reprocessar

### O que Acontece

- A fila é reenviada com os mesmos dados
- Se tiver sucesso, status muda para ✅ (verde)
- Se falhar, permanece ❌ (vermelho)

---

## 👀 VER JSON

### Expandir Dados JSON

Clique em **"Envio"** ou **"Envio Original"** para ver os dados em formato JSON.

A janela mostra:

```
{
  "campo": "valor",
  "aninhado": {
    "subcampo": "subvalor"
  }
}
```

### Syntax Highlighting

O JSON aparece colorido:

- 🔵 Chaves: Azul
- 🟠 Strings: Laranja
- 🟢 Números: Verde
- 🔵 Booleanos: Azul

---

## 🔔 NOTIFICAÇÕES

### Toast (Canto Superior Direito)

Ao executar ações, você vê notificações:

```
✅ [Verde] Fila reprocessada com sucesso!
❌ [Vermelho] Falha ao reprocessar
⏳ [Cinza] Processando...
```

### Características

- Desaparecem automaticamente em 5 segundos
- Barra de progresso mostra tempo restante
- Clique **X** para fechar manualmente
- Podem aparecer várias ao mesmo tempo

---

## 🎨 TEMAS

### Alternar Tema

Clique no ícone de **tema** no canto superior direito (☀️ / 🌙)

### Temas Disponíveis

```
🌙 Escuro (Padrão)
   └─ Fundo escuro, texto claro
   └─ Melhor para trabalhar à noite

☀️ Claro
   └─ Fundo claro, texto escuro
   └─ Melhor para trabalhar de dia
```

---

## ⚙️ TROUBLESHOOTING

### Problema: "Modo Offline"

Se vir esta mensagem, a API não está acessível.

**Solução:**
- Verifique se o servidor backend está rodando
- Verifique a URL da API em `src/config/apiConfig.js`
- Reinicie o servidor frontend

### Problema: Filtros não funcionam

**Solução:**
- Feche e abra os filtros novamente
- Limpe os filtros com "Limpar Filtros"
- Recarregue a página (F5)

### Problema: JSON não aparece

**Solução:**
- Certifique-se de que o campo tem dados
- Se expandido, tente recolher e expandir novamente
- Verifique o console do navegador (F12)

### Problema: Notificação não desaparece

**Solução:**
- Clique no **X** para fechar
- Recarregue a página
- Limpe o cache do navegador

---

## 📞 CONTATO

Para reportar issues:

1. Abra o **Developer Tools** (F12)
2. Veja a aba **Console** para erros
3. Screenshot da erro
4. Descrição do que estava fazendo

---

**Última atualização:** 18/12/2025  
**Versão:** 1.0.0
