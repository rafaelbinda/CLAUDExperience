# MCP Playwright com Claude Code — Passo a Passo

Guia baseado em uma sessão real de uso do MCP Playwright integrado ao Claude Code. Cada etapa reflete exatamente o que foi solicitado e executado.

---

## O que é MCP Playwright?

**MCP** (Model Context Protocol) é um protocolo que permite ao Claude interagir com ferramentas externas em tempo real. O **MCP Playwright** expõe as capacidades do [Playwright](https://playwright.dev/) como ferramentas chamáveis pelo modelo, permitindo navegar, extrair dados e interagir com páginas web via linguagem natural — sem escrever scripts manualmente.

---

## Pré-requisitos

### Passo 1 — Instalar o Node.js

O servidor MCP Playwright roda sobre Node.js. Baixe e instale a versão LTS em:

**https://nodejs.org/**

Após a instalação, verifique no terminal:

```powershell
node --version
npm --version
```

> Na sessão documentada aqui, o usuário confirmou a instalação com:
> _"já instalei o node"_ — e a partir disso o MCP Playwright passou a funcionar corretamente.

---

### Passo 2 — Confirmar que o MCP Playwright está ativo no Claude Code

Com o Node.js instalado e o MCP configurado no Claude Code, as ferramentas do Playwright ficam disponíveis automaticamente. Não é necessário nenhum comando adicional — o Claude reconhece e carrega as ferramentas na sessão.

As ferramentas disponíveis incluem:

| Ferramenta | O que faz |
|---|---|
| `browser_navigate` | Navega para uma URL |
| `browser_evaluate` | Executa JavaScript na página e retorna o resultado |
| `browser_take_screenshot` | Captura screenshot da viewport atual |
| `browser_snapshot` | Captura árvore de acessibilidade da página |
| `browser_click` | Clica em um elemento |
| `browser_fill_form` | Preenche campos de formulário |
| `browser_type` | Digita texto em um elemento |
| `browser_wait_for` | Aguarda condição ou seletor |

---

## Projeto: Scraping de 50 livros com geração de HTML

### Objetivo

Acessar **books.toscrape.com** (site sandbox para praticar scraping), coletar dados de 50 livros e gerar um relatório visual em HTML.

---

### Passo 3 — Testar o MCP navegando para o site

**O que foi pedido:**
> _"como sugestão utilize o endereço https://books.toscrape.com/ acesse esse site e colete dados de 50 livros como nome, preço e a disponibilidade e exiba o resultado em um index.html simples"_

**O que o Claude executou:**

Invocou `browser_navigate` para carregar a página inicial:

```
URL: https://books.toscrape.com/
Título retornado: All products | Books to Scrape - Sandbox
```

---

### Passo 4 — Extrair dados da Página 1 (livros 1 a 20)

Com a página carregada, o Claude executou um script via `browser_evaluate`:

```js
() => {
  const books = [];
  const items = document.querySelectorAll('article.product_pod');
  items.forEach(item => {
    const name         = item.querySelector('h3 a').getAttribute('title');
    const price        = item.querySelector('.price_color').textContent.trim();
    const availability = item.querySelector('.availability').textContent.trim();
    const rating       = item.querySelector('.star-rating').className.replace('star-rating ', '');
    books.push({ name, price, availability, rating });
  });
  return books;
}
```

**Resultado:** 20 livros retornados como JSON, incluindo título, preço, disponibilidade e avaliação (One a Five).

---

### Passo 5 — Navegar para a Página 2 e extrair mais 20 livros

```
URL: https://books.toscrape.com/catalogue/page-2.html
```

Mesmo script de extração executado. Mais 20 livros coletados (livros 21 a 40).

---

### Passo 6 — Navegar para a Página 3 e extrair os últimos 10 livros

```
URL: https://books.toscrape.com/catalogue/page-3.html
```

Script com `.slice(0, 10)` para pegar apenas os primeiros 10 resultados da página:

```js
const items = Array.from(document.querySelectorAll('article.product_pod')).slice(0, 10);
```

**Total coletado: 50 livros** (20 + 20 + 10).

---

### Passo 7 — Gerar o arquivo index.html

Com os dados dos 50 livros em mãos, o Claude gerou o arquivo `index.html` com:

- Tema escuro (`background: #0f1117`)
- Tabela responsiva com scroll horizontal em telas pequenas
- Preços em verde (`#34d399`)
- Disponibilidade colorida (verde = In stock)
- Estrelas de avaliação renderizadas em HTML (★)

Arquivo salvo em:
```
C:\CLAUDExperience\mcp-playright\index.html
```

> **Observação:** O protocolo `file://` é bloqueado pelo MCP Playwright por segurança, então não foi possível verificar o HTML diretamente via browser do Playwright. O arquivo foi aberto manualmente pelo usuário no navegador.

Para abrir o arquivo:
```powershell
start C:\CLAUDExperience\mcp-playright\index.html
```

---

### Passo 8 — Adicionar links clicáveis para cada livro

**O que foi pedido:**
> _"agregue o link de cada um dos livros nesse index.html para que possa clicar e ir direto para a página original"_

**O problema encontrado na primeira tentativa:**

Ao construir a URL manualmente com `getAttribute('href')` concatenado com a base, as URLs ficaram duplicadas:

```
// Errado — gerou: /catalogue/catalogue/livro_123/index.html
'https://books.toscrape.com/catalogue/' + item.querySelector('a').getAttribute('href')
```

**Solução aplicada:**

Usar a propriedade `.href` do DOM, que retorna a URL absoluta já resolvida pelo browser:

```js
() => {
  return Array.from(document.querySelectorAll('article.product_pod')).map(item => ({
    name: item.querySelector('h3 a').getAttribute('title'),
    url:  item.querySelector('h3 a').href   // URL absoluta, sem duplicação
  }));
}
```

O mesmo script foi executado nas três páginas para coletar as 50 URLs.

**O que foi atualizado no index.html:**

1. Adicionado campo `url` em cada objeto do array `books`
2. O título na tabela passou a ser um link:
```html
<a href="${b.url}" target="_blank" rel="noopener">${b.name}</a>
```
3. Adicionado estilo de hover no link (cor azul clara `#7dd3fc`)

---

## Estrutura final do projeto

```
mcp-playright/
├── index.html          # Relatório com os 50 livros e links clicáveis
├── README.md           # Esta documentação
└── .playwright-mcp/    # Gerado automaticamente pelo MCP
    ├── page-*.yml      # Snapshots de acessibilidade de cada página visitada
    ├── page-*.png      # Screenshots capturados durante a sessão
    └── console-*.log   # Logs do console do navegador
```

---

## Resumo dos comandos MCP usados na sessão

| Ordem | Ferramenta | Ação |
|---|---|---|
| 1 | `browser_navigate` | Abriu `https://books.toscrape.com/` |
| 2 | `browser_evaluate` | Extraiu 20 livros da página 1 |
| 3 | `browser_navigate` | Abriu página 2 |
| 4 | `browser_evaluate` | Extraiu 20 livros da página 2 |
| 5 | `browser_navigate` | Abriu página 3 |
| 6 | `browser_evaluate` | Extraiu 10 livros da página 3 |
| 7 | `browser_navigate` | Voltou à página 1 para coletar URLs |
| 8 | `browser_evaluate` | Coletou URLs absolutas da página 1 |
| 9 | `browser_navigate` | Abriu página 2 para coletar URLs |
| 10 | `browser_evaluate` | Coletou URLs absolutas da página 2 |
| 11 | `browser_navigate` | Abriu página 3 para coletar URLs |
| 12 | `browser_evaluate` | Coletou 10 URLs absolutas da página 3 |
| 13 | `browser_take_screenshot` | Capturou screenshot para verificação visual |

---

## Lições aprendidas

- **`.href` vs `getAttribute('href')`** — sempre use `.href` para URLs absolutas; `getAttribute` retorna o valor bruto do atributo, que pode ser relativo e gerar duplicações ao concatenar.
- **Node.js é obrigatório** — o MCP Playwright não funciona sem Node.js instalado, pois o servidor MCP é executado como processo Node.
- **`file://` é bloqueado** — o Playwright bloqueia acesso a arquivos locais via protocolo `file://` por segurança; use um servidor HTTP local para inspecionar HTMLs gerados.
- **Dados ficam em contexto** — os dados coletados via `browser_evaluate` são retornados como JSON para o Claude e mantidos em contexto de conversa, permitindo combinar dados de múltiplas páginas antes de gerar o arquivo final.

---

## Referências

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [books.toscrape.com](https://books.toscrape.com/) — site sandbox para praticar web scraping
