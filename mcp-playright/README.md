# MCP Playwright — Guia de Instalação

Passo a passo para instalar e configurar o **MCP Playwright** no Claude Code, permitindo que o Claude navegue, extraia dados e interaja com páginas web via linguagem natural.

---

## O que foi construído neste projeto

Como prova de conceito do MCP Playwright, o Claude navegou autonomamente pelo site [books.toscrape.com](https://books.toscrape.com/) — um sandbox público para praticar web scraping — e coletou dados de **50 livros** distribuídos em 3 páginas.

Para cada livro foram extraídos: título, preço, disponibilidade, avaliação em estrelas e link direto para a página do produto. Com esses dados, o Claude gerou o arquivo [`index.html`](index.html): uma tabela com tema escuro, links clicáveis e estrelas de avaliação renderizadas em HTML.

Todo o processo — navegação, extração de dados e geração do HTML — foi conduzido via linguagem natural, sem nenhum script escrito manualmente.

---

## O que é MCP Playwright?

**MCP** (Model Context Protocol) é um protocolo que permite ao Claude interagir com ferramentas externas em tempo real. O **MCP Playwright** expõe as capacidades do [Playwright](https://playwright.dev/) como ferramentas chamáveis pelo Claude, sem que você precise escrever scripts manualmente.

Com ele você pode pedir ao Claude coisas como:
- _"Acesse esse site e colete os dados da tabela"_
- _"Tire um screenshot desta página"_
- _"Preencha esse formulário e envie"_

---

## Passo 1 — Instalar o Node.js

O MCP Playwright roda sobre Node.js. Baixe e instale a versão **LTS** em:

**https://nodejs.org/**

> No Windows, use o instalador `.msi`. Marque a opção **"Add to PATH"** durante a instalação.

---

## Passo 2 — Verificar a instalação do Node.js

Abra um terminal (PowerShell ou CMD) e execute:

```powershell
node --version
npm --version
npx --version
```

Você deve ver as versões instaladas, por exemplo:

```
v22.13.1
10.9.2
10.9.2
```

Se algum comando não for reconhecido, feche e reabra o terminal para recarregar o PATH.

---

## Passo 3 — Verificar a instalação do Claude Code

Confirme que o Claude Code está instalado:

```powershell
claude --version
```

Se não estiver instalado, instale via PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

---

## Passo 4 — Criar o arquivo de configuração do MCP

Dentro da pasta do seu projeto, crie o arquivo `.mcp.json` com o seguinte conteúdo:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

> O `npx` vai baixar e executar o servidor MCP Playwright automaticamente na primeira vez que o Claude Code for iniciado. Não é necessário instalar nada globalmente.

---

## Passo 5 — Iniciar o Claude Code no projeto

Navegue até a pasta do projeto e inicie o Claude Code:

```powershell
cd meu-projeto
claude
```

Na primeira execução com o `.mcp.json` presente, o Claude Code detecta o arquivo e carrega o MCP Playwright automaticamente.

---

## Passo 6 — Confirmar que o MCP está ativo

Dentro da sessão do Claude Code, verifique os MCPs carregados com o comando:

```
/mcp
```

Você deve ver `playwright` listado como servidor ativo.

---

## Passo 7 — Testar o MCP

Peça ao Claude algo simples para confirmar que está funcionando:

> _"Acesse https://example.com e me diga o título da página"_

O Claude vai invocar `browser_navigate` e retornar o resultado. Se funcionar, o MCP está configurado corretamente.

---

## Ferramentas disponíveis

Após a configuração, o Claude passa a ter acesso às seguintes ferramentas:

| Ferramenta | O que faz |
|---|---|
| `browser_navigate` | Navega para uma URL |
| `browser_evaluate` | Executa JavaScript na página e retorna o resultado |
| `browser_snapshot` | Captura a árvore de acessibilidade da página |
| `browser_take_screenshot` | Captura screenshot da viewport |
| `browser_click` | Clica em um elemento |
| `browser_type` | Digita texto em um campo |
| `browser_fill_form` | Preenche formulários |
| `browser_select_option` | Seleciona opção em um `<select>` |
| `browser_hover` | Passa o mouse sobre um elemento |
| `browser_press_key` | Pressiona uma tecla do teclado |
| `browser_wait_for` | Aguarda um seletor ou condição |
| `browser_network_requests` | Lista as requisições de rede da página |
| `browser_console_messages` | Retorna os logs do console do browser |
| `browser_tabs` | Lista as abas abertas |
| `browser_close` | Fecha o browser |

---

## Solução de problemas

**`node` não é reconhecido após a instalação**
Feche e reabra o terminal. Se persistir, adicione manualmente ao PATH:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", "User")
```

**O MCP não aparece no `/mcp`**
Confirme que o `.mcp.json` está na raiz da pasta onde o Claude Code foi iniciado.

**Erro ao executar `npx @playwright/mcp@latest`**
Execute o comando manualmente no terminal para ver o erro completo:
```powershell
npx @playwright/mcp@latest
```
Se falhar por falta de browsers, instale-os:
```powershell
npx playwright install
```

---

## Referências

- [Playwright MCP — repositório oficial](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code — documentação](https://docs.claude.com/en/docs/claude-code/overview)
