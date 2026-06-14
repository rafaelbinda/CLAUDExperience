# Word Frequency — CLAUDE.md

## Descrição do projeto

Aplicação web que analisa a frequência de palavras em um bloco de texto. O usuário cola ou digita um texto (ou fornece uma URL), clica em "Translate" e vê um gráfico de barras e uma tabela com cada palavra única e quantas vezes ela aparece, ordenada da mais frequente para a menos frequente.

Nível: Beginner (Tier 1).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | JavaScript (vanilla) |
| Marcação | HTML5 |
| Estilo | CSS3 (puro, sem framework) |
| Gráfico | Chart.js (CDN) |
| URL fetch | fetch API + proxy CORS `allorigins.win` |

Sem build tool, sem bundler, sem framework. O projeto roda diretamente no browser abrindo o `index.html`.

---

## Estrutura de pastas

```
word-frequency/
├── index.html       # Estrutura da página
├── style.css        # Estilos
├── script.js        # Lógica de análise e renderização
├── App.md           # Especificação original do projeto
└── CLAUDE.md        # Este arquivo
```

---

## Funcionalidades

### Obrigatórias

- [x] Exibir caixa de texto (textarea), botão "Translate" e tabela de frequência
- [x] Aceitar entrada de texto de até 2048 caracteres
- [x] Analisar a frequência ao clicar em "Translate"
- [x] Exibir mensagem de erro se o campo estiver vazio
- [x] Popular a tabela com as colunas: palavra e frequência
- [x] Ordenar a tabela em ordem decrescente de frequência

### Extras (Bonus — do App.md)

- [x] Exibir gráfico de barras com top 15 palavras (Chart.js)
- [x] Permitir entrada de URL de página web para analisar o conteúdo dela

### Extras adicionais implementados

- [x] Botão "Clear" para resetar textarea, tabela e gráfico
- [x] Toggle de case-sensitive (por padrão analisa em minúsculas)
- [x] Suporte a caracteres acentuados (`é`, `ñ`, `ü`, etc.) via regex Unicode `\p{L}\p{N}`
- [x] Badges de ranking (ouro/prata/bronze) para o top 3 na tabela
- [x] Contador de caracteres com alerta visual ao se aproximar do limite
- [x] Acessibilidade: `aria-live` nos resultados e `aria-describedby` nos campos de entrada

---

## Comandos para rodar o projeto

O projeto não tem dependências instaláveis. Para rodar:

### Opção 1 — Abrir direto no browser

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Opção 2 — Servidor local (recomendado para a função de URL)

**A funcionalidade de análise por URL exige um servidor local.** Abrir o `index.html` diretamente via `file://` faz o browser tratar a origem como `null`, e o proxy CORS bloqueia requisições de origem nula.

```powershell
# PowerShell nativo (sem dependências)
cd word-frequency
powershell -ExecutionPolicy Bypass -File serve.ps1
```

```bash
# Com Node.js instalado
npx serve .

# Com Python 3
python -m http.server 8080
```

Acesse `http://localhost:8080` no browser.

> O fetch por URL usa o proxy público `allorigins.win` para contornar CORS. Em redes restritas ou com o proxy fora do ar, essa funcionalidade pode não responder.
