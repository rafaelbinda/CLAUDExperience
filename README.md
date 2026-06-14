# 🤖 Claude Code — Guia de Bolso

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20VS%20Code-blue)
![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Idioma](https://img.shields.io/badge/idioma-PT--BR-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-lightgrey)

> Para devs experientes que estão começando com Claude Code. Sem enrolação.

---

## 📋 Sumário

- [1. Instalação no Windows](#1-instalação-no-windows)
- [2. Integração com VS Code](#2-integração-com-vs-code)
- [3. Estrutura de Projeto](#3-estrutura-de-projeto)
- [4. CLAUDE.md — O Briefing do Projeto](#4-claudemd--o-briefing-do-projeto)
- [5. Comandos Slash Essenciais](#5-comandos-slash-essenciais)
- [6. Atalhos de Teclado no Terminal](#6-atalhos-de-teclado-no-terminal)
- [7. Modos de Execução](#7-modos-de-execução-níveis-de-autonomia)
- [8. Prefixos Especiais no Chat](#8-prefixos-especiais-no-chat)
- [9. Erros Comuns](#9-erros-comuns-e-como-evitar)
- [10. Fluxo de Trabalho Recomendado](#10-fluxo-de-trabalho-recomendado)
- [11. Dicas para Quem Vem de Desenvolvimento Tradicional](#11-dicas-para-quem-vem-de-desenvolvimento-tradicional)
- [12. Referências](#12-referências)

---

## 1. Instalação no Windows

### Opção A — Instalador nativo (recomendado)

**Zero dependências. Auto-atualiza em background. Um único comando.**

Abra o **PowerShell** e rode:

```powershell
irm https://claude.ai/install.ps1 | iex
```

> Não precisa de Node.js, npm ou configuração de PATH. Este é o método oficial da Anthropic desde 2026.

### ⚠️ Erro de PATH após instalação (caso comum)

O instalador pode avisar que o diretório `C:\Users\SEU_USUARIO\.local\bin` não está no PATH, fazendo com que `claude` não seja reconhecido no terminal.

**Correção via PowerShell:**

```powershell
[Environment]::SetEnvironmentVariable(
  "Path",
  [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\SEU_USUARIO\.local\bin",
  "User"
)
```

> Substitua `SEU_USUARIO` pelo seu usuário do Windows. Depois **feche e reabra o terminal** — obrigatório para recarregar o PATH.

**Correção via interface gráfica:**

1. `Win + R` → digite `sysdm.cpl` → Enter
2. Aba **Avançado** → botão **Variáveis de Ambiente**
3. Em **Variáveis do usuário**, clique em **Path** → **Editar**
4. Clique em **Novo** → cole `C:\Users\SEU_USUARIO\.local\bin`
5. OK em tudo → feche e reabra o terminal

**Confirme a instalação:**

```powershell
claude --version
```

**Diagnóstico (se ainda não funcionar):**

```powershell
$env:PATH  # verifica se o caminho aparece na lista
```

---

### Opção B — Via npm (se preferir fixar versão)

Requer Node.js 18+. Use **nvm** para gerenciar versões do Node:

```powershell
# Instale o nvm para Windows em: github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20

# Instala o Claude Code
npm install -g @anthropic-ai/claude-code

# Confirma
claude --version
```

> ⚠️ Nunca use `npm install` como Administrador. Se der erro de permissão, instale o Node via nvm (que fica no diretório do usuário).

---

### Autenticação

Na primeira execução, abre o browser automaticamente para autenticar:

```bash
claude
```

Ou autentique via API key (útil em ambientes headless):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
claude
```

---

## 2. Integração com VS Code

### Terminal integrado

O Claude Code roda direto no terminal integrado do VS Code (`` Ctrl + ` ``). Nenhuma extensão obrigatória — é só abrir o terminal e chamar `claude`.

### Extensão oficial

Instale a extensão **Claude Code** na marketplace do VS Code para ter o agente acessível como painel lateral, com suporte a diff visual e aprovação de edições dentro do próprio editor.

### Atalhos úteis no VS Code + Claude Code

| Ação | Como fazer |
|---|---|
| Abrir terminal integrado | `` Ctrl + ` `` |
| Abrir nova aba de terminal | `` Ctrl + Shift + ` `` |
| Navegar entre terminais | `Ctrl + PageUp / PageDown` |
| Tela cheia no terminal | `Ctrl + Shift + P` → "Toggle Terminal Full Screen" |

---

## 3. Estrutura de Projeto

```
meu-projeto/
├── CLAUDE.md                  # instruções permanentes do projeto ← ESSENCIAL
├── .claude/
│   ├── settings.json          # config do time (versionado no Git)
│   ├── settings.local.json    # config pessoal (gitignored)
│   ├── commands/              # seus slash commands customizados
│   │   └── deploy.md          # vira o comando /deploy
│   ├── agents/                # subagents especializados
│   └── hooks/                 # scripts disparados em eventos do agente
└── ~/.claude/
    └── CLAUDE.md              # preferências globais (todos os projetos)
```

**Regra de ouro:** versione `CLAUDE.md`, `commands/`, `agents/` no Git. Coloque `settings.local.json` no `.gitignore`.

---

## 4. CLAUDE.md — O Briefing do Projeto

Carregado automaticamente em toda sessão. É o "onboarding" que você daria a um dev novo. **Mantenha abaixo de 200 linhas.**

### Template mínimo

```markdown
# Projeto
App de gestão de pedidos em Node.js + PostgreSQL.

# Comandos
- `npm run dev` — sobe local na :3000
- `npm test` — Jest (rode antes de commitar)
- `npm run migrate` — aplica migrations

# Convenções
- TypeScript strict mode
- Commits em conventional commits (feat:, fix:, chore:)
- Pastas: src/controllers/, src/services/, src/models/

# Não faça
- Não instale dependências sem perguntar
- Não toque em /migrations (gerado automaticamente)
- Não use `any` em TypeScript

# Quando travar
Pergunte antes de supor. Suposições silenciosas custam caro.
```

### Boas práticas

- **Imperativo > descritivo:** "Use TypeScript strict" bate "este projeto usa TypeScript strict"
- **Mostre, não conte:** comandos exatos, paths exatos, exemplos curtos
- **Liste o que NÃO fazer:** pastas geradas, libs banidas, padrões em deprecação
- **Atualize em tempo real:** no chat, prefixe com `#` → Claude propõe adicionar ao CLAUDE.md

---

## 5. Comandos Slash Essenciais

### Gerenciamento de sessão

| Comando | O que faz |
|---|---|
| `/init` | Gera o CLAUDE.md inicial lendo seu repo. **Sempre o primeiro comando num projeto novo.** |
| `/clear` | Limpa o contexto e começa do zero. Use entre tarefas não-relacionadas. |
| `/compact` | Resume a conversa mantendo o essencial. Para sessões longas que precisam continuar. |
| `/resume` | Retoma a sessão anterior. Salva quando o terminal fecha sem querer. |
| `/help` | Lista tudo disponível, incluindo seus comandos customizados. |

### Controle de custo e modelo

| Comando | O que faz |
|---|---|
| `/cost` | **Mostra quantos tokens e quanto custou a sessão até agora.** Use para decidir quando trocar de modelo. |
| `/model` | Troca o modelo em uso (Opus / Sonnet / Haiku). Calibre pela complexidade da tarefa. |

> 💡 **Dica de custo:** Sonnet resolve ~90% dos casos. Reserve Opus para arquitetura e problemas complexos. Use `/cost` regularmente para não ter surpresas.

### Git e código

| Comando | O que faz |
|---|---|
| `/review` | Code review dos arquivos modificados. **Rode sempre antes de criar um PR.** |
| `/pr` | Cria pull request com título e descrição gerados a partir do diff. |

### Extensibilidade

| Comando | O que faz |
|---|---|
| `/mcp` | Gerencia servidores MCP conectados (GitHub, Postgres, Linear, Sentry...). |
| `/agents` | Lista subagents disponíveis do projeto e globais. |

---

## 6. Atalhos de Teclado no Terminal

| Atalho | Ação |
|---|---|
| `Shift + Tab` | Liga/desliga auto-accept (aceita edições automaticamente sem pedir confirmação) |
| `Esc` | Interrompe a tarefa atual |
| `Esc Esc` | Edita a última mensagem enviada |
| `Ctrl + R` | Busca no histórico de comandos do terminal |
| `!comando` | Roda comando shell direto sem sair do Claude (ex: `!git status`) |
| `#instrução` | Atualiza o CLAUDE.md com a instrução digitada |

---

## 7. Modos de Execução (Níveis de Autonomia)

| Modo | O que faz | Quando usar |
|---|---|---|
| **Read-only** | Só lê, propõe diffs. Não toca em nada. | Explorar base de código alheia ou auditar. |
| **Suggest** | Propõe mudanças e pede confirmação a cada passo. | **Modo padrão para começar.** Você aprova tudo. |
| **Auto-edit** | Edita arquivos sozinho, pergunta antes de rodar comandos. | Bom equilíbrio entre velocidade e controle. |
| **Full-auto** | Executa tudo em sandbox sem pedir confirmação. | Tarefas longas e paralelas em ambiente isolado. |

> 🔰 **Para quem está começando:** comece no modo `suggest`, observe o que o agente faz e suba a autonomia gradualmente conforme ganha confiança.

---

## 8. Prefixos Especiais no Chat

| Prefixo | Efeito |
|---|---|
| `# instrução` | Adiciona a instrução diretamente ao CLAUDE.md do projeto |
| `! comando` | Executa um comando shell sem sair da sessão |
| `@arquivo` | Referencia um arquivo específico para contexto |

---

## 9. Erros Comuns (e como evitar)

| Erro | Por que acontece | Como evitar |
|---|---|---|
| Pular o `/init` | Sem CLAUDE.md, ele adivinha convenções e erra | Sempre comece por `/init` num projeto novo |
| CLAUDE.md gigante | Detalhe demais polui o contexto da sessão | Mantenha < 200 linhas. Quebre em sub-CLAUDE.md por pasta |
| Não rodar `/review` antes do PR | Passa bobagem que seria fácil de pegar | Rode `/review` sempre antes de criar PR |
| Escrever descritivo no CLAUDE.md | "Este projeto usa X" é menos eficaz | Use imperativos: "Use X", "Não faça Y" |
| Deixar o Claude decidir arquitetura | Implementação ≠ decisão arquitetural | Use para implementar. Arquitetura pede revisão humana |
| Ignorar `/compact` | Sessão longa = tokens caros + contexto poluído | Compacte entre tarefas não-relacionadas |
| Sessão longa sem `/cost` | Gasto acumulado sem perceber | Rode `/cost` regularmente para monitorar |
| `claude` não reconhecido após instalar | Diretório `.local\bin` não está no PATH | Adicione ao PATH e reabra o terminal (ver seção 1) |

---

## 10. Fluxo de Trabalho Recomendado

```
1. Abra o terminal integrado do VS Code (Ctrl + `)
2. Navegue até o projeto: cd meu-projeto
3. Inicie o Claude: claude
4. Primeiro uso no projeto: /init  → edite o CLAUDE.md gerado
5. Descreva a tarefa em linguagem natural
6. Revise as mudanças propostas antes de aceitar
7. Antes do PR: /review
8. Para ver o gasto: /cost
9. Entre tarefas diferentes: /clear ou /compact
```

---

## 11. Dicas para Quem Vem de Desenvolvimento Tradicional

- **Não é um autocomplete** — é um agente que lê todo o projeto e toma decisões. Trate como um dev júnior que precisa de contexto.
- **Contexto é tudo** — quanto mais específico o CLAUDE.md, melhores as respostas. Invista 10 minutos configurando antes de começar.
- **Itere** — a segunda e terceira resposta quase sempre são melhores que a primeira. Peça ajustes na mesma sessão.
- **Monitore os tokens** — use `/cost` para entender quanto cada tipo de tarefa consome. Isso guia a escolha de modelo.
- **Aprovação humana** — para ações com efeito (PR, deploy, query no banco), peça o plano primeiro, depois autorize.

---

## 12. Referências

| Recurso | Link |
|---|---|
| Documentação oficial Claude Code | https://docs.claude.com/en/docs/claude-code/overview |
| npm package | https://www.npmjs.com/package/@anthropic-ai/claude-code |
| Suporte Claude.ai | https://support.claude.com |
| Repositório de Skills da Anthropic | https://github.com/anthropics/skills |
| Este repositório | https://github.com/rafaelbinda/ClaudeExperience |

---

## 🤝 Contribuindo

Encontrou algo desatualizado ou quer adicionar um comando que usa no dia a dia? Abra uma [issue](https://github.com/rafaelbinda/ClaudeExperience/issues) ou um [pull request](https://github.com/rafaelbinda/ClaudeExperience/pulls). Este é um guia vivo — cresce com o uso.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais informações.

---

<p align="center">
  Feito com ☕ e muito <code>/cost</code> para não estourar o limite &nbsp;·&nbsp;
  <a href="https://github.com/rafaelbinda/ClaudeExperience">rafaelbinda/ClaudeExperience</a>
</p>
