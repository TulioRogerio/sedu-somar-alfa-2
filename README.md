# Somar - Página Inicial

Aplicação para prototipagem da página inicial do sistema Somar.

## Tecnologias

- React 18
- TypeScript
- Vite
- PrimeReact

## Estrutura

- `docs/` - Documentação e orientações
- `data/` - Dados estáticos (CSV)
- `src/` - Código fonte
  - `components/` - Componentes React
  - `types/` - Definições TypeScript
  - `utils/` - Funções utilitárias

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy no GitHub Pages

O projeto está configurado para fazer deploy automático no GitHub Pages através do GitHub Actions.

### Configuração Inicial

1. **Tornar o repositório público (necessário para GitHub Pages gratuito):**
   - Vá em Settings > General > Danger Zone
   - Clique em "Change repository visibility"
   - Selecione "Make public"
   - ⚠️ **Importante:** O GitHub Pages gratuito só funciona com repositórios públicos. Se precisar manter privado, será necessário fazer upgrade para GitHub Enterprise.

2. **Habilitar GitHub Pages no repositório:**
   - Vá em Settings > Pages
   - Em "Source", selecione "GitHub Actions"

3. **Ajustar o base path (se necessário):**
   - O base path está configurado para `/sedu-somar-alfa-2/` no arquivo `vite.config.ts` (linha 7).
   - Se o nome do repositório mudar, edite o arquivo `vite.config.ts` e altere o valor do `base` para corresponder ao novo nome.
   - O formato deve ser: `/[nome-do-repositorio]/` (com barras e sem espaços)

### Deploy Automático

O deploy acontece automaticamente quando você faz push para a branch `main`. O workflow `.github/workflows/deploy.yml` irá:
- Fazer build do projeto
- Fazer deploy para o GitHub Pages

### Deploy Manual

Você também pode acionar o deploy manualmente:
- Vá em Actions > Deploy to GitHub Pages > Run workflow

### Verificar o Deploy

Após o deploy, acesse a URL:
```
https://[seu-usuario].github.io/[nome-do-repositorio]/
```

## Dados

Os dados das escolas estão no arquivo `data/escolas.csv` com:
- 20 escolas
- 6 municípios
- 3 regionais

## Fases

Consulte o arquivo `fases.md` para acompanhar o progresso do projeto.

